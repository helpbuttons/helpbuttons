import { ImageGallery } from 'elements/ImageGallery';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { formatMessage } from 'elements/Message';
import Link from 'next/link';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { useFocusOn } from 'shared/helpers/scroll.helper';
import { GlobalState, store, useGlobalStore } from 'state';
import { FindAndSetMainPopupCurrentProfile } from 'state/HomeInfo';

export default function PostMessage({ post }) {
    const onClick = (e) =>{
      e.preventDefault()
      store.emit(new FindAndSetMainPopupCurrentProfile(post.author.username))
    }
    const focusPostId = useGlobalStore(
      (state: GlobalState) => state.activities.focusPostId,
    );
    const {ref, focus} = useFocusOn(focusPostId, post.id)
  return (
    <>
      <div className={"card-notification__content"+( focus ? ' card-notification-comment-focus' : '')}>
      <div ref={focus ? ref : null}></div>
        <div className="card-notification__avatar">
          <div className="avatar-small">
          <Link href="#" onClick={onClick}>
            <ImageWrapper
              imageType={ImageType.avatar}
              src={post.author.avatar}
              alt="Avatar"
            />
          </Link>
          </div>
        </div>
        <div className="card-notification__text">
          <div className="card-notification__header">
            <div className="card-notification__info">
              {' '}
              <div className="card-notification__name">
                {post.author.name}
              </div>{' '}
              {/* @{post.author.username} */}
            </div>
            <div className="card-notification__date card-notification__date--nflex">
              <span>{readableTimeLeftToDate(post.created_at)}</span>
            </div>
          </div>
          <h2 className="card-notification__title"></h2>
          <div className="card-notification__paragraph">
           {formatMessage(post.message)}
          </div>
          <ImageGallery images={post?.images.map((image) => {return {src: image, alt: post.message} })} />
        </div>
      </div>
    </>
  );
}
