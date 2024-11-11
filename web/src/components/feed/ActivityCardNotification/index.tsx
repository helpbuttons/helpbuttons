import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import {
  readableTimeLeftToDate,
} from 'shared/date.utils';
import { ActivityEventName } from 'shared/types/activity.list';
import {
  IoAddCircleOutline,
  IoChatbubbleOutline,
  IoNotificationsOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import { formatMessage } from 'elements/Message';
import t from 'i18n';

export default function ActivityCardNotification({ activity }) {
  return (
    <div>
  {(() => {
    switch (activity.eventName) {
      case ActivityEventName.NewButton: {
        return (
        <NotificationCardCustomIcon
          icon={<IoAddCircleOutline />}
          badgeTitle={t('activities.newbuttonType')}
          activity={activity}
        />
        )
      }
      
      case ActivityEventName.NewPost: {
        return (
          <NotificationCardCustomIcon
            icon={<IoPersonOutline />}
            badgeTitle={t('activities.creatorUpdate')}
            activity={activity}
          />
          )
      }

      
      case ActivityEventName.NewPostComment: {
        let  badgeTitle = t('activities.newcommentType');
        if (activity.isPrivate) {
          badgeTitle = t('activities.newprivatecommentType');
        }

        return (
          <NotificationCardCustomIcon
            icon={<IoChatbubbleOutline />}
            badgeTitle={badgeTitle}
            activity={activity}
          />
          )
      }
      
      case ActivityEventName.NewFollowingButton: {
        return (
          <NotificationCardCustomIcon
            icon={<IoChatbubbleOutline />}
            badgeTitle={t('activities.newfollowType')}
            activity={activity}
          />
          )
      }
      case ActivityEventName.NewFollowedButton: {
        return (
          <NotificationCardCustomIcon
            icon={<IoChatbubbleOutline />}
            badgeTitle={t('activities.newfollowType')}
            activity={activity}
          />
          )
      }
      
      case ActivityEventName.ExpiredButton: {
        return (
          <NotificationCardCustomIcon
            icon={<IoChatbubbleOutline />}
            badgeTitle={t('activities.expiredEventType')}
            activity={activity}
          />
          )
      }
      
      case ActivityEventName.DeleteButton: {
        return (
          <NotificationCardCustomIcon
            icon={<IoAddCircleOutline />}
            badgeTitle={t('activities.deletedType')}
            activity={activity}
          />
          )
      }
      
      
      default: {
        const notifIcon = <IoNotificationsOutline />;

        return (
          <NotificationCard
            title={'activities.notification'}
            notifIcon={notifIcon}
            image={'no'}
            date={activity.created_at}
            message={activity.eventName}
            buttonId={0}
            read={activity.read}
            type='unknown'
          />
        )
      }
    }
  })()}
  </div>
    )
}


export function NotificationCardCustomIcon({
  activity,
  icon,
  badgeTitle
}) {
  return (
    <NotificationCard
          type={badgeTitle}
          image={activity.image}
          notifIcon={icon}
          date={activity.createdAt}
          buttonId={activity.referenceId}
          title={activity.title}
          message={activity.message}
          read={activity.read}
        />
  )
  }


export function NotificationCard({
  type,
  title,
  image,
  notifIcon,
  date,
  message = '',
  buttonId,
  read,
}) {
  if (buttonId) {
    return (
      <Link
        href={'/ButtonFile/' + buttonId.toString()}
        className="card-notification card-notification"
      >
        <InnerNotificationCard
          notifIcon={notifIcon}
          type={type}
          title={title}
          image={image}
          date={date}
          message={message}
          read={read}
        />
      </Link>
    );
  }

  return (
    <InnerNotificationCard
      notifIcon={notifIcon}
      type={type}
      title={title}
      image={image}
      date={date}
      message={message}
      read={read}
    />
  );
}

function InnerNotificationCard({notifIcon, type, image, read, date, title, message})
{
  return  (<><div className="card-notification__comment-count">
        <div className="card-notification__label">
          <div className="card-button__status">
            {notifIcon}
            Button type
          </div>
          -
          <p className="">
            Casa de la sierra
          </p>
        </div>
      </div>
      <div className="card-notification__content">
        <div className="card-notification__avatar">
          <div className="avatar-medium">
            <ImageWrapper
              imageType={ImageType.avatarMed}
              src={image}
              alt="image"
            />
          </div>
        </div>
        <div className="card-notification__text">
          <div className="card-notification__header">

            {read ? (
              readableTimeLeftToDate(date)
            ) : (
              <div className="card-notification__date">
                {readableTimeLeftToDate(date)}
              </div>
            )}
            <div className="card-notification__type">{t("common.privado")}</div>
          </div>
          <h2 className="card-notification__title">{title}</h2>
          <div className="card-notification__paragraph">
            {message && formatMessage(message)}
          </div>
        </div>
      </div></>)
}