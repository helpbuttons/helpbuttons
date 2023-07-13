import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import PostMessage from '../PostMessage';
import t from 'i18n';
import { store } from 'pages';
import { DeleteComment } from 'state/Posts';
import { alertService } from 'services/Alert';
import { isAdmin } from 'state/Users';

export default function PostComments({ comments, reloadPosts, loggedInUser, isButtonOwner }) {
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
                    <PostMessage post={comment} />
                    {loggedInUser &&
                    (loggedInUser.id == comment.author.id ||
                      isButtonOwner ||
                      isAdmin(loggedInUser)) && (
                      <Btn
                        submit={true}
                        btnType={BtnType.corporative}
                        caption={t('comment.delete')}
                        contentAlignment={ContentAlignment.center}
                        onClick={() => deleteComment(comment.id)}
                      />
                    )}
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
