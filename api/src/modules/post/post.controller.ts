import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
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
import { CommentPrivacyOptions } from "@src/shared/types/privacy.enum";

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
    async new(
      @Body() message: MessageDto,
      @Param('buttonId') buttonId: string,
      @CurrentUser() user: User,
    ){
      return await this.buttonService.isOwner(user, buttonId).then(
        (isOwner) => {
          if(!isOwner){
            throw new CustomHttpException(ErrorName.NoOwnerShip)
          }
          return this.postService.new(message.message, buttonId, user).then((post) => {
            notifyUser(this.eventEmitter,ActivityEventName.NewPost,post, post.button.owner)
          return post;  
          })
        }
      )
    }

    @OnlyRegistered()
    @Post('new/comment/:privacy/:postId')
    async newComment(
      @Body() message: MessageDto,
      @Param('privacy') privacy: CommentPrivacyOptions,
      @Param('postId') postId: string,
      @CurrentUser() user: User,
    ){
      return await this.commentService.new(message.message, postId, user, privacy).then((comment) => {
        notifyUser(this.eventEmitter,ActivityEventName.NewPostComment, comment, comment.post.author)
      return comment;  
      })
    }
    @OnlyRegistered()
    @Post('update')
    async update(
      @Param('postId') postId: string,
      @Body() message: MessageDto,
      @Param('buttonId') buttonId: string,
      @CurrentUser() user: User,
    ){
      return await this.buttonService.isOwner(user, buttonId).then(
        (isOwner) => {
          if(!isOwner){
            throw new CustomHttpException(ErrorName.NoOwnerShip)
          }
        }
      )
     
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

    // @OnlyRegistered()
    // @Patch('update/message/:messageId/:message')
    // async updateMessage(
    //   @Param('messageId') messageId: string,
    //   @Body() message: MessageDto,
    //   @CurrentUser() user: User,
    //   ) {
    //     // if(!this.buttonService.isOwner(user, buttonId)){
    //     //   throw new CustomHttpException(ErrorName.NoOwnerShip)
    //     // }
    //     console.log(`update message implement me... ${messageId} - ${message}`)
    //     // const response = this.postService.delete(postId);
    //     // return response;
    // }

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
    async findByButtonId(
      @Param('buttonId') buttonId: string,
      @CurrentUser() currentUser: User,
    )
    {
      return await this.postService.findByButtonId(buttonId, currentUser)
    }
  }