import { ApiProperty } from '@nestjs/swagger';
import { FeedButton } from './feed-button.entity';
import { MinLength} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

// https://github.com/typestack/class-validator

export class CreateFeedButtonDto implements Partial<FeedButton> {
  @ApiProperty({
    type: String,
    required: true,
  })
  @MinLength(3, {
    message: 'message about the button',
  })
  message: string;
}


export class UpdateButtonDto extends PartialType(CreateFeedButtonDto) {}