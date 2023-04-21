import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Role } from '@src/shared/types/roles';
import { Repository } from 'typeorm';
import { ButtonService } from '../button/button.service';
import { User } from '../user/user.entity';
import { Post } from './post.entity';

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
      return this.postRepository.insert([
        post
      ]).then(result => post);
    });
  }

  
  findById(id: string) {
    return this.postRepository.findOne({
      where: { id },
      relations: ['author', 'button'],
    });
  }

  public isOwner(currentUser, postId) {
    return this.findById(postId).then((post) => {
      if (
        currentUser.role == Role.admin ||
        currentUser.id == post.author.id
      ) {
        return true;
      }
      return false;
    });
  }

  public findByButtonId(buttonId) {
    return this.postRepository.find({
      where: { button: { id: buttonId } },
      relations: ['comments', 'author', 'comments.author'],
      order: { created_at: 'DESC', comments: { created_at: 'DESC' } },
    });
  }
}
