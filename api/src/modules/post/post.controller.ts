import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@src/shared/decorator/current-user";
import { AllowGuest, OnlyRegistered } from "@src/shared/decorator/roles.decorator";
import { CustomHttpException } from "@src/shared/middlewares/errors/custom-http-exception.middleware";
import { ErrorName } from "@src/shared/types/error.list";
import { ButtonService } from "../button/button.service";
import { User } from "../user/user.entity";
import { CommentService } from "./comment.service";
import { MessageDto } from "./post.dto";
import { PostService } from "./post.service";
import { ActivityEventName } from "@src/shared/types/activity.list";
import { notifyUser } from "@src/app/app.event";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Role } from "@src/shared/types/roles";
import { PrivacyType } from "@src/shared/types/privacy.enum";
import { FileUploadInterceptor, imageFileFilter } from "@src/shared/decorators/file-upload.decorator";

@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly buttonService: ButtonService,
    private readonly commentService: CommentService,
    private eventEmitter: EventEmitter2,
    ) {}

    @OnlyRegistered()
    @Post('new/:buttonId')
    @UseInterceptors(
      FileUploadInterceptor('images[]', 10, imageFileFilter)
    )
    async new(
      @Body() body: any,
      @Param('buttonId') buttonId: string,
      @CurrentUser() user: User,
      @UploadedFiles() images: Express.Multer.File[],
    ){
      return await this.buttonService.isOwner(user, buttonId).then(
        (isOwner) => {
          if(!isOwner){
            throw new CustomHttpException(ErrorName.NoOwnerShip)
          }
          const postData : MessageDto = JSON.parse(body.data);
          
          return this.postService.new(postData.message, images, buttonId, user).then((post) => {
              notifyUser(this.eventEmitter,ActivityEventName.NewPost,{post})
          })
        }
      )
    }

    @OnlyRegistered()
    @Post('new/comment/:postId')
    @UseInterceptors(
      FileUploadInterceptor('images[]', 10, imageFileFilter)
    )
    async newComment(
      @Body() body: any,
      @Param('postId') postId: string,
      @CurrentUser() user: User,
      @UploadedFiles() images: Express.Multer.File[],
    ){
      const commentData : MessageDto = JSON.parse(body.data);

      return await this.commentService.new(commentData.message,images, postId, user).then((comment) => {
        notifyUser(this.eventEmitter,ActivityEventName.NewPostComment, {comment})
      return comment;  
      })
    }


    @OnlyRegistered()
    @Post('new/comment/:postId/:commentParentId')
    @UseInterceptors(
      FileUploadInterceptor('images[]', 10, imageFileFilter)
    )
    async newCommentReply(
      @Body() body: any,
      @Param('postId') postId: string,
      @Param('commentParentId') commentParentId: string,
      @CurrentUser() user: User,
      @UploadedFiles() images: Express.Multer.File[],

    ){
      const commentData : MessageDto = JSON.parse(body.data);
      return await this.commentService.newReply(commentData.message,images, postId, commentParentId, user).then((comment) => {
        notifyUser(this.eventEmitter,ActivityEventName.NewPostComment, {comment})
      return comment;  
      })
    }
    

    @OnlyRegistered()
    @Delete('delete/:postId')
    async delete(
      @Param('postId') postId: string,
      @CurrentUser() user: User,
      ) {
        return await this.postService.findById(postId).then((post) => {
          if((user.role == Role.admin) || post.author.id == user.id || this.buttonService.isOwner(user, post.button.id)){
            return this.postService.delete(postId)
          }
          throw new CustomHttpException(ErrorName.NoOwnerShip)
        }).catch((error) => {
          console.log(error)
          throw new CustomHttpException(ErrorName.nothingToDelete)
        })
        
    }

    @OnlyRegistered()
    @Delete('comment/delete/:commentId')
    async deleteMessage(
      @Param('commentId') commentId: string,
      @CurrentUser() user: User,
      ) {
        return await this.commentService.findById(commentId).then((comment) => {
          if((user.role == Role.admin) || comment.author.id == user.id){
            return this.commentService.delete(commentId)
          }else {
            return this.buttonService.isOwner(user, comment.post.button.id).then((isButtonOwner) => {
              if(isButtonOwner)
              {
                return this.commentService.delete(commentId)
              }
              throw new CustomHttpException(ErrorName.NoOwnerShip)
            })
          }
        })
    }

    @AllowGuest()
    @Get('findByButtonId/:buttonId')
    findByButtonId(
      @Param('buttonId') buttonId: string,
      @CurrentUser() currentUser: User,
    )
    {

      const res = this.postService.findByButtonId(buttonId, currentUser)
      
      return res.then((resultado) => {
        return resultado
      });
    }
  }