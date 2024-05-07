import { IoChatbubbleOutline, IoPersonOutline } from 'react-icons/io5';
import { NotificationCard } from '..';
import t from 'i18n';

export default function ActivityCardNewPost({ post, isRead, button }) {
  const notifIcon = <IoPersonOutline />;

  return (
    <NotificationCard
      type={t('activities.creatorUpdate')}
      notifIcon={notifIcon}
      image={button.image}
      date={post.created_at}
      buttonId={button.id}
      title={t(
        'activities.newpost',
        [post.author.username, button.title],
        true,
      )}
      message={post.message}
      read={isRead}
    />
  );
}

export function ActivityCardNewPostComment({ comment, isRead, button }) {
      const notifIcon = <IoChatbubbleOutline />;
      let title = t('activities.newcommentType');
      if (comment.privacy == 'private') {
        title = t('activities.newprivatecommentType');
      }
      return (
        <NotificationCard
          type={title}
          image={comment.button.image}
          notifIcon={notifIcon}
          date={comment.created_at}
          buttonId={button.id}
          title={t(
            'activities.newcomment',
            [comment.author.username, comment.button.title],
            true,
          )}
          message={comment.message}
          read={isRead}
        />
    );
  }
  
