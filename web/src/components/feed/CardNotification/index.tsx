import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { ActivityEventName } from 'shared/types/activity.list';
import t from 'i18n';
import {  IoAddCircleOutline, IoChatbubbleOutline, IoNotificationsOutline, IoPersonOutline } from "react-icons/io5";
import Link from 'next/link';
import { formatMessage } from 'elements/Message';
import { User } from 'shared/entities/user.entity';
import { useButtonTypes } from 'shared/buttonTypes';
import { useState } from 'react';

export default function CardNotification({ activity = {} }) {
  const [buttonTypes, setButtonTypes] = useState([])
  useButtonTypes(setButtonTypes)
  const notification = (activity) => {
    if (activity.eventName == ActivityEventName.NewButton) {
      const button = activity.data
      const notifIcon =<IoAddCircleOutline/>

      return (
        <NotificationCard
          type={t('activities.newbuttonType')}
          image={button.image}
          notifIcon={notifIcon}
          date={button.created_at}
          id={button.id}
          title={button.title}
          message={t('activities.newbutton', [
            button.address
          ], true)}
          read={activity.read}
        />
      );
    } else if (activity.eventName == ActivityEventName.DeleteButton) {
      let {button} = JSON.parse(activity.data);
      if(!button)
      {
        button = JSON.parse(activity.data);
      }
      const notifIcon =<IoAddCircleOutline/>
      return (
        <NotificationCard
          type={t('activities.deletedType')}
          notifIcon={notifIcon}
          image={button.image}
          date={button.created_at}
          id={button.id}
          title={t('activities.deletebutton', [
            button.title
          ], true)}
          read={activity.read}
        />
      );
    } else if (activity.eventName == ActivityEventName.NewPost) {
      const post = JSON.parse(activity.data);
      const notifIcon =<IoPersonOutline/>

      return (
        <NotificationCard
          type={t('activities.creatorUpdate')}
          notifIcon={notifIcon}
          image={post.button.image}
          date={post.created_at}
          id={post.button.id}
          title={t('activities.newpost', [
            post.author.username,
            post.button.title,
          ], true)}
          message={post.message}
          read={activity.read}
        />
      );
    } else if (
      activity.eventName == ActivityEventName.NewPostComment
    ) {
      const comment = JSON.parse(activity.data);
      const notifIcon =<IoChatbubbleOutline/>
      let title = t('activities.newcommentType');
      if(comment.privacy == 'private') {
        title = t('activities.newprivatecommentType')
      }
      return (
        <NotificationCard
          type={title}
          image={comment.button.image}
          notifIcon={notifIcon}
          date={comment.created_at}
          id={comment.button.id}
          title={t('activities.newcomment', [
            comment.author.username,
            comment.button.title
          ], true)}
          message={comment.message}
          read={activity.read}
        />
      );
    } else if (
        activity.eventName == ActivityEventName.NewFollowingButton
      ) {
        const {button, user} = JSON.parse(activity.data);
        const follower: User = user
        const notifIcon =<IoChatbubbleOutline/>
        return (
          <>
          {buttonTypes?.length > 0 && 
            <NotificationCard
              type={t('activities.newfollowType')}
              title={t('activities.newfollowing', [buttonTypes.find(btnType => btnType.name == button.type).caption], false)}
              image={follower.avatar}
              notifIcon={notifIcon}
              date={activity.created_at}
              id={button.id}
              message={button.title}
              read={activity.read}
            />
          }
          </>
        );
    }  else if (
      activity.eventName == ActivityEventName.NewFollowedButton
    ) {
      const {button, user} = JSON.parse(activity.data);
      const follower: User = user
      const notifIcon =<IoChatbubbleOutline/>
      return (
        <>
        {buttonTypes?.length > 0 && 
          <NotificationCard
            type={t('activities.newfollowType')}
            title={t('activities.newfollowed', [user.username, buttonTypes.find(btnType => btnType.name == button.type).caption], false)}
            image={follower.avatar}
            notifIcon={notifIcon}
            date={activity.created_at}
            id={button.id}
            message={button.title}
            read={activity.read}
          />
        }
        </>
      );
  } else {
      const notifIcon =<IoNotificationsOutline/>

      return (
        <NotificationCard
          title={'activities.notification'}
          notifIcon={notifIcon}
          image={'no'}
          date={activity.created_at}
          message={activity.eventName}
          id={0}
          read={activity.read}
        />
      );
    }
  };

  return <>{notification(activity)}</>;
}

export function NotificationCard({ type, title, image, notifIcon, date, message = '', id, read }) {
  return (
    <Link href={'/ButtonFile/'+ id.toString()} className="card-notification card-notification">
      <div className="card-notification__comment-count">
        <div className="card-notification__label">
          <div className="hashtag hashtag--blue hashtag--with-icon">{notifIcon}{type}</div>
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
            <div className="card-notification__info">
            </div>
            {read ? 
              readableTimeLeftToDate(date)
            : 
            <div className="card-notification__date">
              {readableTimeLeftToDate(date)}
            </div>
            }
            
          </div>
          <h2 className="card-notification__title">{title}</h2>
          <div className="card-notification__paragraph">{message && formatMessage(message)}</div>
        </div>
      </div>
    </Link>
  );
}
