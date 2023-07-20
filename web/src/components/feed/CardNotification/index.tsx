import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { ActivityEventName } from 'shared/types/activity.list';
import { Button } from 'shared/entities/button.entity';
import { makeImageUrl } from 'shared/sys.helper';
import t from 'i18n';

export default function CardNotification({ activity = {} }) {
  const notification = (activity) => {
    if (activity.eventName == ActivityEventName.NewButton) {
      const button = activity.data
      return (
        <NotificationCard
          title={'New Button'}
          image={button.image}
          date={button.created_at}
          id={button.id}
          message={t('activities.newbutton', [
            button.id,
            button.title,
            button.latitude.toString(),
            button.longitude.toString(),
            button.address,
          ])}
          read={activity.read}
        />
      );
    } else if (activity.eventName == ActivityEventName.DeleteButton) {
      const button = JSON.parse(activity.data);
      return (
        <NotificationCard
          title={'Deleted Button'}
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
      return (
        <NotificationCard
          title={'New post'}
          image={post.button.image}
          date={post.created_at}
          id={post.button.id}
          message={t('activities.newpost', [
            post.message,
            post.button.id,
            post.button.title,
          ])}
          read={activity.read}
        />
      );
    } else if (
      activity.eventName == ActivityEventName.NewPostComment
    ) {
      const comment = JSON.parse(activity.data);
      return (
        <NotificationCard
          title={'New notification'}
          image={comment.button.image}
          date={comment.created_at}
          id={comment.button.id}
          message={t('activities.newcomment', [
            comment.message,
            comment.post.message,
            comment.button.id,
            comment.button.title,
          ])}
          read={activity.read}
        />
      );
    } else {
      return (
        <NotificationCard
          title={'New notification'}
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

export function NotificationCard({ title, image, date, message, id, read }) {
  return (
    <a href={'/ButtonFile/'+ id.toString()} className="card-notification card-notification">
      <div className="card-notification__comment-count">
        <div className="card-notification__label">
          <div className="hashtag hashtag--blue">{title}</div>
        </div>
      </div>
      <div className="card-notification__content">
        <div className="card-notification__avatar">
          <div className="avatar-medium">
            <ImageWrapper
              imageType={ImageType.avatar}
              src={makeImageUrl(image)}
              alt="image"
            />
          </div>
          {/* 
            <div className="card-notification__icon">
              <IoClose />
            </div> */}
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
          <h2 className="card-notification__title">{message}</h2>
          <div className="card-notification__paragraph"></div>
        </div>
      </div>
    </a>
  );
}
