import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { ActivityEventName } from 'shared/types/activity.list';
import { Button } from 'shared/entities/button.entity';
import { makeImageUrl } from 'shared/sys.helper';
import t from 'i18n';
import {  IoAddCircleOutline, IoChatbubbleOutline, IoHandLeftOutline, IoHeartOutline, IoNotificationsOutline, IoPersonOutline, IoRibbonOutline } from "react-icons/io5";
import Link from 'next/link';
import { formatMessage } from 'elements/Message';
import { User } from 'shared/entities/user.entity';

export default function CardNotification({ activity = {} }) {
  const notification = (activity) => {
    if (activity.eventName == ActivityEventName.NewButton) {
      const button = activity.data
      const notifIcon =<IoAddCircleOutline/>

      return (
        <NotificationCard
          title={t('activities.newbuttonType')}
          image={button.image}
          notifIcon={notifIcon}
          date={button.created_at}
          id={button.id}
          message={t('activities.newbutton', [
            button.title,
            button.address,
          ])}
          read={activity.read}
        />
      );
    } else if (activity.eventName == ActivityEventName.DeleteButton) {
      const button = JSON.parse(activity.data);
      const notifIcon =<IoAddCircleOutline/>

      return (
        <NotificationCard
          title={t('activities.deletedType')}
          notifIcon={notifIcon}
          image={button.image}
          date={button.created_at}
          id={button.id}
          message={t('activities.deletebutton', [
            button.id,
            button.title,
          ])}
          read={activity.read}
        />
      );
    } else if (activity.eventName == ActivityEventName.NewPost) {
      const post = JSON.parse(activity.data);
      const notifIcon =<IoPersonOutline/>

      return (
        <NotificationCard
          title={t('activities.creatorUpdate')}
          notifIcon={notifIcon}
          image={post.button.image}
          date={post.created_at}
          id={post.button.id}
          message={t('activities.newpost', [
            post.message,
            post.button.title,
            post.author.username,
          ])}
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
          title={title}
          image={comment.button.image}
          notifIcon={notifIcon}
          date={comment.created_at}
          id={comment.button.id}
          message={t('activities.newcomment', [
            comment.message,
            comment.post.message,
            comment.author.username,
          ])}
          read={activity.read}
        />
      );
    } else if (
        activity.eventName == ActivityEventName.NewFollowButton
      ) {
        const {button, user} = JSON.parse(activity.data);
        const follower: User = user
        const notifIcon =<IoChatbubbleOutline/>
        return (
          <NotificationCard
            title={t('activities.newfollowType')}
            image={follower.avatar}
            notifIcon={notifIcon}
            date={activity.created_at}
            id={button.id}
            message={t('activities.newfollowing', [
              button.title
            ])}
            read={activity.read}
          />
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

export function NotificationCard({ title, image, notifIcon, date, message, id, read }) {
  return (
    <Link href={'/ButtonFile/'+ id.toString()} className="card-notification card-notification">
      <div className="card-notification__comment-count">
        <div className="card-notification__label">
          <div className="hashtag hashtag--blue hashtag--with-icon">{notifIcon}{title}</div>
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
          <h2 className="card-notification__title"></h2>
          <div className="card-notification__paragraph">{formatMessage(message[0])}</div>
        </div>
      </div>
    </Link>
  );
}
