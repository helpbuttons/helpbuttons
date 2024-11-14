import { PrivacyType } from "@src/shared/types/privacy.enum";

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
      image: string;
    }
    authorName: string;
    privacy: PrivacyType;
    createdAt: Date;
    id: string;
    read: boolean;
    message: string;
    excerpt: string;
  }

  export const ExcerptMaxChars = 60;