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
      return this.commentRepository.insert([
        {
          id: dbIdGenerator(),
          message,
          post,
          author,
        },
      ]);
    });
  }
}