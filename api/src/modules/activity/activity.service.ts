import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { ActivityEventName } from '@src/shared/types/activity.list';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  @OnEvent(ActivityEventName.NewButton)
  async notifyUser(payload: any) {
    
    console.log('processing this data:')
    console.log(payload.data)
    this.activityRepository.insert([{
      id: dbIdGenerator(),
      owner: payload.data.owner,
      eventName: payload.activityEventName,
      data: JSON.stringify(payload.data)
    }])
  }

  findByUserId(userId: string) {
    return this.activityRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner'],
    });
  }

  markAllAsRead(userId: string) {}
  markAsRead(userId: string, notificationId: string) {}
}