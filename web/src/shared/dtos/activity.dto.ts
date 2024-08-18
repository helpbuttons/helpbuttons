
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
