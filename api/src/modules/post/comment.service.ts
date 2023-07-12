import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { dbIdGenerator } from "@src/shared/helpers/nanoid-generator.helper";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { Comment } from "./comment.entity";
import { PostService } from "./post.service";

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly postSerice: PostService,
  ) {}

  new(message: string, postId: string, author: User) {
    
    return this.postSerice.findById(postId).then((post) => {
      const comment = {
        id: dbIdGenerator(),
        message,
        post,
        author,
      };
      return this.commentRepository.insert([comment]).then((result) => {
        return {...comment, button: post.button}
      });
    });
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
}