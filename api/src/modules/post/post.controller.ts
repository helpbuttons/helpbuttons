import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@src/shared/decorator/current-user.js";
import { AllowGuest, OnlyRegistered } from "@src/shared/decorator/roles.decorator.js";
import { CustomHttpException } from "@src/shared/middlewares/errors/custom-http-exception.middleware.js";
import { ErrorName } from "@src/shared/types/error.list.js";
import { ButtonService } from "../button/button.service.js";
import { User } from "../user/user.entity.js";
import { CommentService } from "./comment.service.js";
import { MessageDto } from "./post.dto.js";
import { PostService } from "./post.service.js";
import { ActivityEventName } from "@src/shared/types/activity.list.js";
import { notifyUser } from "@src/app/app.event.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Role } from "@src/shared/types/roles.js";
import { PrivacyType } from "@src/shared/types/privacy.enum.js";

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
      @Body() data: MessageDto,
      @Param('buttonId') buttonId: string,
      @CurrentUser() user: User,
    ){
      return await this.buttonService.isOwner(user, buttonId).then(
        (isOwner) => {
          if(!isOwner){
            throw new CustomHttpException(ErrorName.NoOwnerShip)
          }
          return this.postService.new(data.message, data.images, buttonId, user).then((post) => {
              notifyUser(this.eventEmitter,ActivityEventName.NewPost,{post})
          })
        }
      )
    }

    @OnlyRegistered()
    @Post('new/comment/:privacy/:postId')
    async newComment(
      @Body() data: MessageDto,
      @Param('privacy') privacy: PrivacyType,
      @Param('postId') postId: string,
      @CurrentUser() user: User,
    ){
      return await this.commentService.new(data.message,data.images, postId, user, privacy).then((comment) => {
        notifyUser(this.eventEmitter,ActivityEventName.NewPostComment, {comment})
      return comment;  
      })
    }


    @OnlyRegistered()
    @Post('new/comment/:privacy/:postId/:commentParentId')
    async newCommentReply(
      @Body() data: MessageDto,
      @Param('privacy') privacy: PrivacyType,
      @Param('postId') postId: string,
      @Param('commentParentId') commentParentId: string,
      @CurrentUser() user: User,
    ){
      return await this.commentService.newReply(data.message,data.images, postId, commentParentId, user, privacy).then((comment) => {
        notifyUser(this.eventEmitter,ActivityEventName.NewPostComment, {comment})
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