import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const specialCharRegex = /(?=.*[!@#$%^&*()_\-+=].*[!@#$%^&*()_\-+=])/;

export class SignupRequestDto {
  // @ApiProperty({
  //   description:
  //     'User realm, A field or domain of activity or interest.',
  //   default: 'marketing',
  //   type: String,
  //   required: true,
  //   example: 'sell',
  //   isArray: false,
  // })
  // @IsString()
  // realm: string;

  @ApiProperty({
    description: 'Email should be also unique',
    default: 'sample@example.com',
    type: String,
    required: true,
    example: 'sample@example.com',
    isArray: false,
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Name',
    default: 'name',
    type: String,
    required: true,
    isArray: false,
    format: 'string',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: `User password should follow this conditions:
      1. At least 8 character
    `,
    type: String,
    required: true,
    example: '111222AvvD!@',
    isArray: false,
  })
  @IsString()
  @MinLength(8)
  // @Matches(specialCharRegex, {
  //   message: `Password should contains special character.`,
  // })
  // @Matches(/(?=.*[a-z].*[a-z])/, {
  //   message: `Password should contains at least two lowercase letter.`,
  // })
  // @Matches(/(?=.*[A-Z].*[A-Z])/, {
  //   message: `Password should contains at least two uppercase letter.`,
  // })
  // @Matches(/(?=.*[0-9].*[0-9])/, {
  //   message: `Password should contains at least two number.`,
  // })
  password: string;

  // @ApiProperty({
  //   description: 'User interests, fields or domains of interest.',
  //   default: ['sport', 'reading'],
  //   type: [String],
  //   required: false,
  //   example: ['sport', 'reading'],
  //   isArray: true,
  // })
  // @IsString({ each: true })
  // interests: [string];
}

export class LoginRequestDto {
  @ApiProperty({
    description: 'Email should be also unique',
    default: 'sample@example.com',
    type: String,
    required: true,
    example: 'sample@example.com',
    isArray: false,
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: `User password should follow this conditions:
      1. At least 2 uppercase letter
      2. At least 2 lowercase letter
      3. At least 2 number
      4. At least 2 special character
      5. At least 8 character
    `,
    default: '12AvD!@',
    type: String,
    required: true,
    example: '12AvD!@',
    isArray: false,
  })
  @IsString()
  @MinLength(8)
  @Matches(specialCharRegex, {
    message: `Password should contains special character.`,
  })
  @Matches(/(?=.*[a-z].*[a-z])/, {
    message: `Password should contains at least two lowercase letter.`,
  })
  @Matches(/(?=.*[A-Z].*[A-Z])/, {
    message: `Password should contains at least two uppercase letter.`,
  })
  @Matches(/(?=.*[0-9].*[0-9])/, {
    message: `Password should contains at least two number.`,
  })
  password: string;
}
