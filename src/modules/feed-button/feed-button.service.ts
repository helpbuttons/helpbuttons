import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { getManager } from 'typeorm';
import { ButtonService } from '../button/button.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { CreateFeedButtonDto } from './feed-button.dto';
import { FeedButton } from './feed-button.entity';

@Injectable()
export class FeedButtonService {
  constructor(
    @InjectRepository(FeedButton)
    private readonly feedButtonRepository: Repository<FeedButton>,
    private readonly buttonService: ButtonService,
  ) {}

  async create(
    createDto: CreateFeedButtonDto,
    author: User,
    buttonId: string,
    images: File[],
  ) {
    const button = await this.buttonService.findById(buttonId);
    if (!button) {
      throw new HttpException(
        { message: 'button not found' },
        HttpStatus.BAD_REQUEST,
      );
    }
    let feedButton = {
      id: dbIdGenerator(),
      message: createDto.message,
      author,
      button,
    };
    return this.feedButtonRepository.insert([feedButton]);
  }

  async remove(id: string) {
    return this.feedButtonRepository.delete({ id });
  }

}
