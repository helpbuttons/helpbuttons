import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { dateLeft } from "shared/sys.helper";

export default function PostMessage({ post }) {
  return (
    <>
      <div className="card-notification__paragraph">
        {post.message}
      </div>
      <div className="card-notification__header">
        <h2 className="card-notification__title"></h2>
      </div>
      <div className="card-notification__date card-notification__date--nflex">
        <span>{dateLeft(post.created_at)}</span>
        <div>
          <div className="avatar-small">
            <ImageWrapper
              imageType={ImageType.avatar}
              src={post.author.avatar}
              alt="Avatar"
            />
          </div>{' '}
          {post.author.name}{' '}
          <span style={{ color: 'gray' }}>
            @{post.author.username}
          </span>
        </div>
      </div>
    </>
  );
}
