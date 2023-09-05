import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Role } from '@src/shared/types/roles';
import { Repository } from 'typeorm';
import { ButtonService } from '../button/button.service';
import { User } from '../user/user.entity';
import { Post } from './post.entity';
import { CommentPrivacyOptions } from '@src/shared/types/privacy.enum';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @Inject(forwardRef(() => ButtonService))
    private buttonService: ButtonService,
  ) {}

  new(message: string, buttonId: string, author: User) {
    return this.buttonService.findById(buttonId).then((button) => {
      const post = {
        id: dbIdGenerator(),
        message,
        button,
        author,
      };
      return this.postRepository
        .insert([post])
        .then((result) => post);
    });
  }

  findById(id: string) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['author', 'button'],
    });
  }

  public findByButtonId(buttonId, currentUser) {
    return this.postRepository
      .find({
        where: { button: { id: buttonId }, deleted: false },
        relations: ['comments', 'author', 'comments.author'],
        order: {
          created_at: 'DESC',
          comments: { created_at: 'DESC' },
        },
      })
      .then((posts) => {
        let deleteCommentsPosts = this.removeDeletedComments(posts);
        return this.removePrivateComments(
          deleteCommentsPosts,
          currentUser,
        );
      });
  }

  removeDeletedComments(posts) {
    return posts.map((post) => {
      return {
        ...post,
        comments: post.comments.filter(
          (comment) => comment.deleted == false,
        ),
      };
    });
  }

  removePrivateComments(posts, currentUser) {
    return posts.map((post) => {
      return {
        ...post,
        comments: post.comments.filter(
          (comment) =>
            comment.privacy == CommentPrivacyOptions.PUBLIC ||
            post.author.id == currentUser?.id ||
            comment.author.id == currentUser?.id,
        ),
      };
    });
  }

  async delete(postId: string) {
    return this.findById(postId).then((post) => {
      return this.postRepository
        .update(post.id, { deleted: true })
        .then((res) => {
          return post;
        });
    });
  }
}
