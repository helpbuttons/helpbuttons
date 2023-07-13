import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import PostMessage from '../PostMessage';
import t from 'i18n';
import { store } from 'pages';
import { DeleteComment } from 'state/Posts';
import { alertService } from 'services/Alert';
import { isAdmin } from 'state/Users';

export default function PostComments({ comments, reloadPosts, loggedInUser, isButtonOwner, buttonOwnerId }) {
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
            {comments.map((comment) => {
              return (
                <div className='card-notification--comment'>

                  <PostMessage isButtonOwnerComment={buttonOwnerId == comment.author.id} post={comment} />
                  
                  <div className='card-notification--comment-actions'>

                    {loggedInUser &&
                      (loggedInUser.id == comment.author.id ||
                        isButtonOwner ||
                        isAdmin(loggedInUser)) && (
                        <Btn
                          submit={true}
                          btnType={BtnType.link}
                          caption={t('comment.delete')}
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

        {comments.length < 1 && <>{t('post.NoComments')}</>}
      </>
    </>
  );
}
