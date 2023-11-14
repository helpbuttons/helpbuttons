import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import { store } from 'pages';
import { DeleteComment } from 'state/Posts';
import { alertService } from 'services/Alert';
import { isAdmin } from 'state/Users';
import { IoArrowUndoSharp, IoMailOutline, IoTrashBinOutline } from 'react-icons/io5';
import { readableTimeLeftToDate } from 'shared/date.utils';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { CommentPrivacyOptions } from 'shared/types/privacy.enum';
import { formatMessage, mentionsOfMessage } from 'elements/Message';
import { uniqueArray } from 'shared/sys.helper';

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

  const handleClick = (comment, privateMessage) => {
    let mentions = mentionsOfMessage(comment.message)
    mentions.push(comment.author.username)
    
    onComposeReplyToComment(
      comment.id,
      mentions,
      privateMessage
    )
  }
  
  return (
    <>
      <>
        {comments.length > 0 && (
          <>
            {comments.map((comment, key) => {
              return (
                <div key={key} className="card-notification--comment">
                  <CommentMessage
                    post={comment}
                  />
                  <div className="message__actions">

                  {(comment.privacy == CommentPrivacyOptions.PRIVATE) &&
                     <Btn
                       submit={false}
                       btnType={BtnType.iconActions}
                       iconLink={<IoMailOutline />}
                       iconLeft={IconType.circle}
                       contentAlignment={ContentAlignment.right}
                       onClick={() =>
                         handleClick(comment, true)
                       }
                     />
                  }
                   {(comment.privacy == CommentPrivacyOptions.PUBLIC) &&
                     <Btn
                       submit={false}
                       btnType={BtnType.iconActions}
                       iconLink={<IoArrowUndoSharp />}
                       iconLeft={IconType.circle}
                       contentAlignment={ContentAlignment.right}
                       onClick={() =>
                         handleClick(comment, false)
                       }
                     />
                  }
                 
                 
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
