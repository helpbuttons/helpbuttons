import { IoChatbubbleOutline, IoPersonOutline } from 'react-icons/io5';
import { NotificationCard } from '..';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useStore } from 'store/Store';

export default function ActivityCardNewPost({ post, isRead, button }) {
  const notifIcon = <IoPersonOutline />;

  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
    false,
  );
  let title = t(
    'activitiesWithSubject.newpost',
    [post.author.name, button.title],
    true,
  )
  
  if (loggedInUser && loggedInUser.id == button.owner.id) {
    title = t('activities.newpost', [button.title], true);
  }

  return (
    <NotificationCard
      type={t('activities.creatorUpdate')}
      notifIcon={notifIcon}
      image={button.image}
      date={post.created_at}
      buttonId={button.id}
      title={title}
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
  
// functions to support depecrated activities
export const getPostActivity = (rawData) => { const data = JSON.parse(rawData); return data?.post ? data?.post: data }


export const getCommentActivity = (rawData) => { const data = JSON.parse(rawData); return data?.comment ? data?.comment: data }