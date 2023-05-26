import PostMessage from "../PostMessage";

export default function PostComments({ showComments, comments }) {

  
    

  return (
    <>
      
          {showComments && (
            <>
            {comments.map((comment) => {
              return (
                <>
                <hr/>
                <PostMessage post={comment} />
                </>
              )
              })}

            </>
          )}
          
           
    </>
  );
}
