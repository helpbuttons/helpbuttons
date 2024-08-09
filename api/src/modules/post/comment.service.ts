import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { dbIdGenerator } from "@src/shared/helpers/nanoid-generator.helper";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { Comment } from "./comment.entity";
import { PostService } from "./post.service";
import { CommentPrivacyOptions } from "@src/shared/types/privacy.enum";
import { StorageService } from "../storage/storage.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly postSerice: PostService,
    @Inject(StorageService)
    private storageService: StorageService
  ) {}

  new(message: string, images: string[], postId: string, author: User, privacy: CommentPrivacyOptions) {
    return this.storageService.storageMultipleImages(images)
    .then((imagesStored ) => {
      return this.postSerice.findById(postId).then((post) => {
        const comment = {
          id: dbIdGenerator(),
          message,
          images: imagesStored,
          post,
          author,
          privacy
        };
        return this.commentRepository.insert([comment]).then((result) => {
          return {...comment, button: post.button}
        });
      });
    })
  }

  newReply(message: string, images: string[], postId: string, commentParentId: string, author: User, privacy: CommentPrivacyOptions) {
    return this.storageService.storageMultipleImages(images)
    .then((imagesStored ) => {
    return this.postSerice.findById(postId).then((post) => {
      const comment = {
        id: dbIdGenerator(),
        message,
        images: imagesStored,
        post,
        author,
        privacy,
        commentParentId: commentParentId,
      };
      return this.commentRepository.insert([comment]).then((result) => {
        return {...comment, button: post.button}
      });
    });
    })
  }

  findById(id: string) {
    return this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'post', 'post.button'],
    });
  }

  async delete(messageId: string) {
    return this.findById(messageId).then((comment) => {
      return this.commentRepository.update(comment.id,{ deleted: true }).then((res) => {
        return comment
      })
    }) 
  }

  public deleteme(authorId: string)
  {
    return this.commentRepository.find({where: {post: {author: {id: authorId}}}}).then((comments) => 
    {
      return this.commentRepository.remove(comments)
    })
  }
}