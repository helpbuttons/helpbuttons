//notification card that can be used in a notif menu or a message notification, it's the same as feed card with slight modifitaion for different purposes.
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import DebugToJSON from 'elements/Debug';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { ActivityEventName } from 'shared/types/activity.list';
import { Button } from 'shared/entities/button.entity';
import { makeImageUrl } from 'shared/sys.helper';

export default function CardNotification({ activity = {} }) {
  return (
    <>
      {activity.button && (
        <ButtonNotification
          button={activity.button}
          action={activity.eventName}
        />
      )}
    </>
  );
}

export function ButtonNotification({
  button,
  action,
}: {
  button: Button;
  action: string;
}) {
  return (
    <>
      <div className="card-notification card-notification">
        <div className="card-notification__content">
          <div className="card-notification__avatar">
            <div className="avatar-medium">
              <ImageWrapper
                imageType={ImageType.avatar}
                src={makeImageUrl(button.image)}
                alt="Avatar"
              />
            </div>
{/* 
            <div className="card-notification__icon">
              <IoClose />
            </div> */}
          </div>
          <div className="card-notification__text">
            <div className="card-notification__header">
              <div className="card-notification__info">{/*action*/}</div>
              <div className="card-notification__date">
                {readableTimeLeftToDate(button.created_at)}
              </div>
            </div>
            <h2 className="card-notification__title">
              You created this <a href={`/ButtonFile/${button.id}`}>button</a> was
              created in <a href={`/Explore/?latitude=${button.latitude}&longitude=${button.longitude}`}>{button.address}</a>
            </h2>
            <div className="card-notification__paragraph"></div>
          </div>
        </div>
      </div>
    </>
  );
}
