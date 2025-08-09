import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonModule } from '../button/button.module.js';
import { UserModule } from '../user/user.module.js';
import { Comment } from './comment.entity.js';
import { CommentService } from './comment.service.js';
import { PostController } from './post.controller.js';
import { Post } from './post.entity.js';
import { PostService } from './post.service.js';
import { StorageModule } from '../storage/storage.module.js';


@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Post]),
    UserModule,
    forwardRef(() => ButtonModule),
    UserModule,
    StorageModule
  ],
  controllers: [
    PostController
  ],
  providers: [
    CommentService,
    PostService
  ],
  exports: [
    CommentService,
    PostService
  ]
})
export class PostModule {}
