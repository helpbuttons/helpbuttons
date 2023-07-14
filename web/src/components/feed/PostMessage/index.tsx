import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { formatMessage } from 'elements/Message';
import { readableTimeLeftToDate } from 'shared/date.utils';

export default function PostMessage({ post, isButtonOwnerComment }) {
  return (
    <>
      {!isButtonOwnerComment && (
        <div className="message message--others">
          <div className="message__header">
            <div className="message__user-name-container">
              <p className="message__user-name">
                {post.author.name} @{post.author.username}
              </p>
            </div>
          </div>

          <div className="message__content">{post.message}</div>

          <div className="message__hour">
            {readableTimeLeftToDate(post.created_at)}
          </div>

          <div className="message__avatar">
            <ImageWrapper
              imageType={ImageType.avatar}
              src={post.author.avatar}
              alt="Avatar"
            />
          </div>
        </div>
      )}
      {isButtonOwnerComment && (
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
              <div class="card-notification__info">
                {' '}
                <div class="card-notification__name">
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
      )}
    </>
  );
}
