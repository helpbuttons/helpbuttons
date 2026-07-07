import { IsNotEmpty, IsObject, IsString, IsOptional } from 'class-validator'

export class PushSubscriptionKeysDto {
  @IsString()
  @IsNotEmpty()
  p256dh: string

  @IsString()
  @IsNotEmpty()
  auth: string
}

export class SubscribeDto {
  @IsString()
  @IsNotEmpty()
  endpoint: string

  @IsOptional()
  expirationTime?: number | null

  @IsObject()
  @IsNotEmpty()
  keys: PushSubscriptionKeysDto
}

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  message: string

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  icon?: string
}