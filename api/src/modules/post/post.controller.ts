import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "@src/shared/decorator/current-user";
import { OnlyRegistered } from "@src/shared/decorator/roles.decorator";
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
    new(
      @Body() message: MessageDto,
      @Param('buttonId') buttonId: string,
      @CurrentUser() user: User,
    ){
      return this.buttonService.isOwner(user, buttonId).then(
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
    @Post('new/comment/:postId')
    newComment(
      @Body() message: MessageDto,
      @Param('postId') postId: string,
      @CurrentUser() user: User,
    ){
      return this.commentService.new(message.message, postId, user).then((comment) => {
        notifyUser(this.eventEmitter,ActivityEventName.NewPostComment, comment, comment.post.author)
      return comment;  
      })
      
    }

    @OnlyRegistered()
    @Post('update')
    update(
      @Param('postId') postId: string,
      @Body() message: MessageDto,
      @Param('buttonId') buttonId: string,
      @CurrentUser() user: User,
    ){
      return this.buttonService.isOwner(user, buttonId).then(
        (isOwner) => {
          if(!isOwner){
            throw new CustomHttpException(ErrorName.NoOwnerShip)
          }
        }
      )
     
    }
    

    @OnlyRegistered()
    @Delete('delete/:buttonId')
    async delete(
      @Param('postId') postId: string,
      @CurrentUser() user: User,
      ) {
        // if(!this.buttonService.isOwner(user, buttonId)){
        //   throw new CustomHttpException(ErrorName.NoOwnerShip)
        // }
        // const response = this.postService.delete(postId);
        // return response;
    }

    @OnlyRegistered()
    @Patch('update/message/:messageId/:message')
    async updateMessage(
      @Param('messageId') messageId: string,
      @Body() message: MessageDto,
      @CurrentUser() user: User,
      ) {
        // if(!this.buttonService.isOwner(user, buttonId)){
        //   throw new CustomHttpException(ErrorName.NoOwnerShip)
        // }
        console.log(`update message implement me... ${messageId} - ${message}`)
        // const response = this.postService.delete(postId);
        // return response;
    }

    @OnlyRegistered()
    @Patch('delete/message/:messageId')
    async deleteMessage(
      @Param('messageId') messageId: string,
      @CurrentUser() user: User,
      ) {
        console.log(`delete message implement me... ${messageId} `)
        // if(!this.buttonService.isOwner(user, buttonId)){
        //   throw new CustomHttpException(ErrorName.NoOwnerShip)
        // }        // const response = this.postService.delete(postId);
        // return response;
    }

    @Get('findByButtonId/:buttonId')
    async findByButtonId(
      @Param('buttonId') buttonId: string
    )
    {
      return this.postService.findByButtonId(buttonId)
    }
  }