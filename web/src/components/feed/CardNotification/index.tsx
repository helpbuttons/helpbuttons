//notification card that can be used in a notif menu or a message notification, it's the same as feed card with slight modifitaion for different purposes.
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import DebugToJSON from 'elements/Debug';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { ActivityEventName } from 'shared/types/activity.list';
import { Button } from 'shared/entities/button.entity';
import { makeImageUrl } from 'shared/sys.helper';
import { Network } from 'shared/entities/network.entity';
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import t from 'i18n';
import { Post } from 'shared/entities/post.entity';
import { Comment } from 'shared/entities/comment.entity';

export default function CardNotification({ activity = {} }) {
  const notification = (activity) => {
    if(activity.eventName == ActivityEventName.NewButton) {
      return (
        <ButtonNotification
          button={activity.data}
          action={activity.eventName}
        />
      )
    }else if(activity.eventName == ActivityEventName.NewPost){
      return <PostNotification
                post={JSON.parse(activity.data)}
                action={activity.eventName}
            />
    }else if(activity.eventName == ActivityEventName.NewPostComment){
      return <CommentNotification
                comment={JSON.parse(activity.data)}
                action={activity.eventName}
          />
    }else{
      return (
        <Notification text={activity.eventName} created_at={activity.created_at}/>
      )
    }
  }
  
  return (
    <>
      {notification(activity)}
    </>
  );
}

export function Notification({
  text,
  created_at
}) {
  const selectedNetwork: Network = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  return (
 
    <div className="card-notification card-notification">
         <div className="card-notification__comment-count">
          <div className='card-notification__label'>
            <div className='hashtag hashtag--blue'>Notification</div>
          </div>
        </div>
        <div className="card-notification__content">
          <div className="card-notification__avatar">
            <div className="avatar-medium">
              <ImageWrapper
                imageType={ImageType.avatar}
                src={makeImageUrl(selectedNetwork?.logo)}
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
                {readableTimeLeftToDate(created_at)}
              </div>
            </div>
            <h2 className="card-notification__title">
              {text}
            </h2>
            <div className="card-notification__paragraph"></div>
          </div>
        </div>
      </div>
  )
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
      <a href={"/ButtonFile/"+button.id} className="card-notification card-notification">
        <div className="card-notification__comment-count">
          <div className='card-notification__label'>
            <div className='hashtag hashtag--blue'>New Button</div>
          </div>
        </div>
        <div className="card-notification__content">
          <div className="card-notification__avatar">
            <div className="avatar-medium">
              <ImageWrapper
                imageType={ImageType.avatar}
                src={makeImageUrl(button.image)}
                alt={button.title}
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
            { t('activities.newbutton', [button.id, button.title, button.latitude.toString(), button.longitude.toString(), button.address]) }
              {}
              
            </h2>
            <div className="card-notification__paragraph"></div>
          </div>
        </div>
      </a>
    </>
  );
}

export function PostNotification({
  post,
  action,
}: {
  post: Post;
  action: string;
}) {
  console.log(post)
  return (
    <>
      <div className="card-notification">
        <div className="card-notification__comment-count">
          <div className='card-notification__label'>
            <div className='hashtag hashtag--blue'>New Post</div>
          </div>
        </div>
        <div className="card-notification__content">
          <div className="card-notification__avatar">
            <div className="avatar-medium">
              <ImageWrapper
                imageType={ImageType.avatar}
                src={makeImageUrl(post.button.image)}
                alt={post.message}
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
                {readableTimeLeftToDate(post.created_at)}
              </div>
            </div>
            <h2 className="card-notification__title">
            { t('activities.newpost', [post.message,post.button.id, post.button.title]) }
              {}
              
            </h2>
            <div className="card-notification__paragraph"></div>
          </div>
        </div>
      </div>
    </>
  );
}


export function CommentNotification({
  comment,
  action,
}: {
  comment: Comment;
  action: string;
}) {
  console.log(comment)
  return (
    <>
      <div className="card-notification">
        <div className="card-notification__comment-count">
          <div className='card-notification__label'>
            <div className='hashtag hashtag--blue'>New comment</div>
          </div>
        </div>
        <div className="card-notification__content">
          <div className="card-notification__avatar">
            <div className="avatar-medium">
              <ImageWrapper
                imageType={ImageType.avatar}
                src={makeImageUrl(comment.button.image)}
                alt={comment.message}
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
                {readableTimeLeftToDate(comment.created_at)}
              </div>
            </div>
            <h2 className="card-notification__title">
            { t('activities.newcomment', [comment.message,comment.post.message,comment.button.id, comment.button.title]) }
              {}
              
            </h2>
            <div className="card-notification__paragraph"></div>
          </div>
        </div>
      </div>
    </>
  );
}