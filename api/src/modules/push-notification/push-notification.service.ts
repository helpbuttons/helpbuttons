import { Injectable, OnModuleInit, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as webpush from 'web-push'
import { SendNotificationDto, SubscribeDto } from './push-notification.dto'
import { UserService } from '../user/user.service'
import { User } from '../user/user.entity'
import { ActivityTemplateVars } from '../activity/out/activity'
import { NetworkService } from '../network/network.service'
import { GroupMessageType } from '@src/shared/types/group-message.enum'

@Injectable()
export class PushNotificationService implements OnModuleInit {
  private readonly logger = new Logger(PushNotificationService.name)

  private subscriptions: Map<string, SubscribeDto> = new Map()
  private vapidkeysOk :boolean = false;
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly networkService: NetworkService
 ) {}

  onModuleInit() {
    const publicKey = this.configService.get<string>('VAPID_PUBLIC_KEY')
    const privateKey = this.configService.get<string>('VAPID_PRIVATE_KEY')
    const email = `mailto:${this.configService.get<string>('adminemail')}`

    if (!publicKey || !privateKey) {
      this.logger.error('VAPID keys are not configured!')
      return;
      // throw new Error('VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY must be set')
    }

    webpush.setVapidDetails(email, publicKey, privateKey)
    this.vapidkeysOk = true;
    this.logger.log('VAPID details configured successfully')
  }

  subscribe(user: User, subscription: SubscribeDto) {
    return  this.userService.addEndPoint(user.id, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth, subscription.expirationTime)
  }

  unsubscribe(user: User) {
    return this.userService.removeEndPoint(user.id)
  }

  async sendNotificationToAll(message: string): Promise<{
    success: boolean
    sent: number
    failed: number
  }> {
        const payload = JSON.stringify({
            title: 'Notification',
            body: message,
            icon: '/icon.png',
        })

        let sent = 0
        let failed = 0
        const staleEndpoints: string[] = []

        if(!this.vapidkeysOk)
        {
          this.logger.error('VAPID keys are not configured')
          return
        }
        await this.userService.allEndPoints().then((users) => {
            users.map((subscription) => {
                if(!subscription.endpoint){
                  return;
                }
                try {
                    return webpush.sendNotification(
                        {
                            endpoint: subscription.endpoint,
                            keys: {
                                p256dh: subscription.p256dh,
                                auth: subscription.auth,
                            },
                        },
                        payload,
                    )
                    sent++;
                } catch(error: any) {
                    failed++
                    this.logger.error(`Failed to send to ${subscription.endpoint}:`, error.message)

                    // Remove expired/invalid subscriptions (410 Gone or 404)
                    if (error.statusCode === 410 || error.statusCode === 404) {
                        staleEndpoints.push(subscription.endpoint)
                    }
                }
        })        
      },
    )
    // Clean up stale subscriptions
    console.log('TODO SOMETHINg.. remove from users')
    // staleEndpoints.forEach((endpoint) => this.subscriptions.delete(endpoint))

    this.logger.log(`Notifications sent: ${sent}, failed: ${failed}`)
    return { success: true, sent, failed }
  }

  async sendNotificationToUser(templateVars: ActivityTemplateVars){
    const network = await this.networkService.findDefaultNetwork()
    
    if(!templateVars.to){
      this.logger.warn('could not send notification to user ', JSON.stringify(templateVars))
      return;
    }
    const user = await this.userService.findOneByEmail(templateVars.to)
    
    const dto: SendNotificationDto = {message: templateVars.content, title: templateVars.subject, icon: '/api' + network.logo};
    this.sendNotificationToOne(user.endpoint, dto, user.id, user.p256dh, user.auth)
  }

  async sendNotificationToOne(
    endpoint: string,
    dto: SendNotificationDto,
    userId,
    p256dh, 
    auth
  ): Promise<{ success: boolean }> {
    if (!endpoint) {
      this.logger.error('user subscrition not found - ' + userId)
      return;
    }

    const payload = JSON.stringify({
      title: dto.title || 'Notification',
      body: dto.message,
      icon: dto.icon || '/api/networks/logo/144',
    })
    
    if(!this.vapidkeysOk)
    {
      this.logger.error('VAPID keys are not configured')
      return
    }

    try {
      await webpush.sendNotification(
        {
          endpoint: endpoint,
          keys: {
            p256dh: p256dh,
            auth: auth,
          },
        },
        payload,
      )
      return { success: true }
    } catch (error: any) {
      this.logger.error('Error sending push notification:', error)

      if (error.statusCode === 410 || error.statusCode === 404) {
        this.subscriptions.delete(endpoint)
      }

      throw error
    }
  }

  getVapidPublicKey(): string {
    return this.configService.get<string>('VAPID_PUBLIC_KEY')!
  }

  getSubscriptionCount(): number {
    return this.subscriptions.size
  }
}