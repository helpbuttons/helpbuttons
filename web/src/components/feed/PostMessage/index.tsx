import { ImageGallery } from 'elements/ImageGallery';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { formatMessage } from 'elements/Message';
import Link from 'next/link';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { PrivacyType } from 'shared/types/privacy.enum';
import { store } from 'state';
import { FindAndSetMainPopupCurrentProfile } from 'state/HomeInfo';

export default function PostMessage({ post }) {
    const onClick = (e) =>{
      e.preventDefault()
      store.emit(new FindAndSetMainPopupCurrentProfile(post.author.username))
    }
  return (
    <>
      <div className="card-notification__content">
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
