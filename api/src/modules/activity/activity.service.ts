import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { ActivityEventName } from '@src/shared/types/activity.list';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { MailService } from '../mail/mail.service';
import translate from '../../shared/helpers/i18n.helper';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private mailService: MailService
  ) {}

  @OnEvent(ActivityEventName.NewPost)
  @OnEvent(ActivityEventName.NewPostComment)
  @OnEvent(ActivityEventName.NewButton)
  @OnEvent(ActivityEventName.DeleteButton)
  async notifyOwner(payload: any) {
    const activity = {
      id: dbIdGenerator(),
      owner: payload.destination,
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data)
    };
    this.activityRepository.insert([activity])
  }

  @OnEvent(ActivityEventName.NewPostComment)
  async mailOwner(payload: any) {
    const activity = {
      id: dbIdGenerator(),
      owner: payload.destination,
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data)
    };
    console.log(payload.data)
    console.log(payload.destination)
    const messageContent = translate('en','activities.newpost', [
      payload.data.message,
      payload.data.button.title,
    ])
    this.mailService.sendActivity(
      {
        content: messageContent,
        to: payload.destination.email
    })
    // this.activityRepository.insert([activity])
  }

  findByUserId(userId: string) {
    return this.activityRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
      order: { created_at: 'DESC' },
    });
  }

  markAllAsRead(userId: string) {
    return this.activityRepository.update({read: false, owner: { id: userId } }, {read: true} )
  }

  markAsRead(userId: string, notificationId: string) {
    return this.activityRepository.update({id: notificationId, owner: { id: userId } }, {read: true} )
  }
}
