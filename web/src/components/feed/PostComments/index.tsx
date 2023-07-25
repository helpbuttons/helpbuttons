import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import PostMessage from '../PostMessage';
import t from 'i18n';
import { store } from 'pages';
import { DeleteComment } from 'state/Posts';
import { alertService } from 'services/Alert';
import { isAdmin } from 'state/Users';
import { IoTrashBinOutline } from 'react-icons/io5';

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
            {comments.map((comment, key) => {
              return (
                <div key={key} className='card-notification--comment'>

                  <PostMessage isButtonOwnerComment={buttonOwnerId == comment.author.id} post={comment} />
                  
                  <div className='message__actions'>

                    {loggedInUser &&
                      (loggedInUser.id == comment.author.id ||
                        isButtonOwner ||
                        isAdmin(loggedInUser)) && (
                        <Btn
                          submit={true}
                          btnType={BtnType.iconActions}
                          iconLink={<IoTrashBinOutline/>}
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
