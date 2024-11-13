import { PrivacyType } from "@src/shared/types/activity.list";

export enum NotificationType {
    All,
    MyActivity,
    Interests,
    MyHelpbuttons,
  }

export class ActivityDtoOut {
    id: string;
    eventName: string;
    title: string;
    message: string;
    createdAt: string;
    referenceId: string;
    read: boolean;
    image: string;
    isPrivate: boolean;
    isOwner: boolean;
  }

  export class ActivityMessageDto{
    image: string;
    button: {
      type: string;
      title: string;
      id: string;
    }
    authorName: string;
    privacy: PrivacyType;
    messageExcerpt: string;
    createdAt: Date;
    id: string;
    read: boolean;
  }
