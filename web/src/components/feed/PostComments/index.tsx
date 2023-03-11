import PostMessage from "../PostMessage";

export default function PostComments({ showComments, comments }) {

  
    

  return (
    <>
      
          {showComments && (
            <>
            {comments.map((comment) => {
              return (
                <>
                <PostMessage post={comment} />
                <hr/>
                </>
              )
              })}

            </>
          )}
          
           
    </>
  );
}
