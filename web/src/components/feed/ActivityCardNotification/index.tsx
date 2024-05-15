import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import {
  readableDate,
  readableTimeLeftToDate,
} from 'shared/date.utils';
import { ActivityEventName } from 'shared/types/activity.list';
import {
  IoNotificationsOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import { formatMessage } from 'elements/Message';
import ActivityCardNewButton, { ActivityCardDeleteButton, ActivityCardExpiredButton, ActivityCardNewFollowedButton, ActivityCardNewFollowingButton } from './types/button';
import ActivityCardNewPost, { ActivityCardNewPostComment } from './types/post';
import { useButtonTypes } from 'shared/buttonTypes';
import { useEffect } from 'react';

export default function ActivityCardNotification({ activity, buttonTypes }) {

  return (
    <div>
  {(() => {
    switch (activity.eventName) {
      case ActivityEventName.NewButton: {
        const button = activity.data.button ? activity.data.button : activity.data
        return (
          <ActivityCardNewButton
            button={button}
            isRead={activity.read}
          />
        );
      }
      case ActivityEventName.NewPost: {
        const activityData = JSON.parse(activity.data)
        const post = activityData?.post ? activity.post : activityData;
        const button = post.button

        return (
          <ActivityCardNewPost
            post={post}
            button={button}
            isRead={activity.read}
          />
        );
      }
      case ActivityEventName.NewPostComment: {
        const activityData = JSON.parse(activity.data)
        const comment = activityData?.comment ? activity.comment : activityData;
        const button = comment.button 
        return (
          <ActivityCardNewPostComment
            comment={comment}
            button={button}
            isRead={activity.read}
          />
        );
      }
      case ActivityEventName.NewFollowingButton: {
        const { button, user } = JSON.parse(activity.data);
        return (
          <ActivityCardNewFollowingButton
            button={button}
            follower={user}
            isRead={activity.read}
            date={activity.created_at}
            buttonTypes={buttonTypes}
          />
        )
      }
      case ActivityEventName.NewFollowedButton: {
        const { button, user } = JSON.parse(activity.data);
        return (
          <ActivityCardNewFollowedButton
            button={button}
            followed={user}
            isRead={activity.read}
            date={activity.created_at}
            buttonTypes={buttonTypes}
          />
        )
      }
      case ActivityEventName.ExpiredButton: {
        const {button} = JSON.parse(activity.data)
        return (
          <ActivityCardExpiredButton
            button={button}
            isRead={activity.read}
            date={activity.created_at}
          />
        );
      }
      case ActivityEventName.DeleteButton: {
        const {button} = JSON.parse(activity.data)
        return <ActivityCardDeleteButton button={button} isRead={activity.read} date={activity.created_at}/>
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
          <div className="hashtag hashtag--blue hashtag--with-icon">
            {notifIcon}
            {type}
          </div>
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
            <div className="card-notification__info"></div>
            {read ? (
              readableTimeLeftToDate(date)
            ) : (
              <div className="card-notification__date">
                {readableTimeLeftToDate(date)}
              </div>
            )}
          </div>
          <h2 className="card-notification__title">{title}</h2>
          <div className="card-notification__paragraph">
            {message && formatMessage(message)}
          </div>
        </div>
      </div></>)
}