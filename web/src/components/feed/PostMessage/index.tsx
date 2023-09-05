import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { formatMessage } from 'elements/Message';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { CommentPrivacyOptions } from 'shared/types/privacy.enum';

export default function PostMessage({ post }) {
  return (
    <>
      <div className="card-notification__content">
        <div className="card-notification__avatar">
          <div className="avatar-small">
            <ImageWrapper
              imageType={ImageType.avatar}
              src={post.author.avatar}
              alt="Avatar"
            />
          </div>
        </div>
        <div className="card-notification__text">
          <div className="card-notification__header">
            <div className="card-notification__info">
              {' '}
              <div className="card-notification__name">
                {post.author.name}
              </div>{' '}
              @{post.author.username}
            </div>
            <div className="card-notification__date card-notification__date--nflex">
              <span>{readableTimeLeftToDate(post.created_at)}</span>
            </div>
          </div>
          <h2 className="card-notification__title"></h2>
          <div className="card-notification__paragraph">
            {formatMessage(post.message)}
          </div>
        </div>
      </div>
    </>
  );
}
