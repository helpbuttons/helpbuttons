import PostMessage from "../PostMessage";
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';
import FormSubmit from 'elements/Form/FormSubmit';
import { useForm } from "react-hook-form";
import { useState } from "react";
export default function PostComments({ comments }) {

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm();


  const onNewCommentSubmit = (data) => {
    /*store.emit(new CreateButtonPostComment(
      {
        
      },
      buttondId,
      post.id,
      () => {
        console.log('yeaaah')
      },
      (errorMessage) => {
        alertService.error(errorMessage)
      }

    ));*/

    // store.emit(
    //   new CreateButton(data, selectedNetwork.id, 
    //     onSuccess({lat: data.latitude, lng: data.longitude}), 
    //     onError),
    // );
    console.log(data)
    setShowNewCommentDialog(false)
  };
    const [showNewCommentDialog, setShowNewCommentDialog] =
    useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <div
          style={{
            'backgroundColor': '#C0C0C0',
            'textAlign': 'right',
          }}
        >
          <a
            onClick={() => {
              setShowComments(!showComments);
            }}
          >
            {comments.length > 0
              ? '+' +
              comments.length +
                ' comment' +
                (comments.length > 1 ? 's' : '')
              : ''}
          </a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a onClick={() => {
            setShowNewCommentDialog(!showNewCommentDialog)
          }}>
          Leave comment >
          </a>
          {showComments && (
            <>
            {comments.map((comment) => {
              return (
                // {JSON.stringify(comment)}
                <>
                <PostMessage post={comment} />
                <hr/>
                </>
              )
              })}

            </>
          )}
          {showNewCommentDialog && (
            <>
            <div className="picker__close-container">
          <div className="picker--over picker-box-shadow picker__content picker__options-v">
          <Form
        onSubmit={handleSubmit(onNewCommentSubmit)}
        classNameExtra="publish_btn"
      >
        <FieldTextArea
            label="Comment:"
            name="comment"
            placeholder="Write your comment"
            validationError={errors.description}
            classNameExtra="squared"
            {...register('comment', {
              required: true,
              minLength: 10,
            })}
          />
          <div className="publish__submit">
          <FormSubmit
            classNameExtra="create_btn"
            title="Publish"
            isSubmitting={isSubmitting}
          />
        </div>
        </Form>
            </div>
            <div
            className="picker__close-overlay"
            onClick={() => setShowNewCommentDialog(false)}
          ></div>
           </div>
            </>
          )}
          {/* {showCommentDialog ? 
            <span>comment here</span>
          :
          <Link onclick={setShowCommentDialog(true)}>
          {item.comments.length > 0
            ? item.comments.length +
              ' comment' +
              (item.comments.length > 1 ? 's' : '')
            : 'Leave comment >'}
        </Link>
          } */}
        </div>
    </>
  );
}
