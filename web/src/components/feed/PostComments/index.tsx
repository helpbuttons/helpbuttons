import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { store } from 'pages';
import { DeleteComment } from 'state/Posts';
import { alertService } from 'services/Alert';
import { isAdmin } from 'state/Users';
import { IoArrowUndoSharp, IoTrashBinOutline } from 'react-icons/io5';
import { readableTimeLeftToDate } from 'shared/date.utils';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { CommentPrivacyOptions } from 'shared/types/privacy.enum';
import { formatMessage } from 'elements/Message';

export default function PostComments({
  comments,
  reloadPosts,
  loggedInUser,
  isButtonOwner,
  buttonOwnerId,
  onComposeReplyToComment,
}) {
  const deleteComment = (commentId) => {
    store.emit(
      new DeleteComment(commentId, reloadPosts, (error) => {
        alertService.error(error.caption);
      }),
    );
  };
  return (
    <>
      <>
        {comments.length > 0 && (
          <>
            {comments.map((comment, key) => {
              return (
                <div key={key} className="card-notification--comment">
                  <CommentMessage
                    isButtonOwnerComment={
                      buttonOwnerId == comment.author.id
                    }
                    post={comment}
                  />

                  <div className="message__actions">
                    {loggedInUser && (
                      <Btn
                        submit={false}
                        btnType={BtnType.iconActions}
                        iconLink={<IoArrowUndoSharp />}
                        iconLeft={IconType.circle}
                        contentAlignment={ContentAlignment.right}
                        onClick={() =>
                          onComposeReplyToComment(
                            comment.id,
                            comment.author.username,
                          )
                        }
                      />
                    )}
                    {loggedInUser &&
                      (loggedInUser.id == comment.author.id ||
                        isButtonOwner ||
                        isAdmin(loggedInUser)) && (
                        <Btn
                          submit={true}
                          btnType={BtnType.iconActions}
                          iconLink={<IoTrashBinOutline />}
                          iconLeft={IconType.circle}
                          contentAlignment={ContentAlignment.right}
                          onClick={() => deleteComment(comment.id)}
                        />
                      )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </>
    </>
  );
}

export function CommentMessage({ post }) {
  return (
    <>
      {/* {!isButtonOwnerComment && ( */}
      <div className="message message--others">
        <div className="message__header">
          <div className="message__user-name-container">
            <p className="message__author">
              <span className="message__name">
                {post.author.name}
              </span>{' '}
              @{post.author.username}
            </p>
          </div>
        </div>

        <div className="message__content">
          {formatMessage(post.message)}
        </div>

        <div className="message__hour">
          {readableTimeLeftToDate(post.created_at)},{' '}
          {post.privacy == CommentPrivacyOptions.PRIVATE && (
            <span style={{ color: 'red' }}>private</span>
          )}
        </div>

        <div className="message__avatar">
          <ImageWrapper
            imageType={ImageType.avatar}
            src={post.author.avatar}
            alt="Avatar"
          />
        </div>
      </div>
    </>
  );
}
