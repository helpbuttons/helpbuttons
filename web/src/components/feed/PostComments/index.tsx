import PostMessage from '../PostMessage';
import t from 'i18n';

export default function PostComments({ comments }) {
  return (
    <>
      <>
        {comments.length > 0 && (
          <>
            {comments.map((comment) => {
              return (
                <div style={{"padding" : '2em', backgroundColor: 'lightgrey'}}>
                  <hr />
                  <PostMessage post={comment} />
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
