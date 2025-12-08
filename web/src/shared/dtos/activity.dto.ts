export class ActivityDtoOut {
  id: string;
  eventName: string;
  read: boolean;
  createdAt: Date;
  title: string;
  from: string;
  image: string;
  buttonType: string;
  type: string;
  footer: string;
  message: string;
  buttonId: string;
  fromId: string;
  consumerId: string;
}

export const ExcerptMaxChars = 60;
export const ActivitiesPageSize = 10;

export class MessageDto {
  message: string;
}