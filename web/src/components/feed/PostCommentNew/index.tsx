import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';
import FormSubmit from 'elements/Form/FormSubmit';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { CreateNewPostComment } from 'state/Posts';


export default function PostCommentNew({ postId, onSubmit }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmitLocal = (data) => {
    store.emit(
      new CreateNewPostComment(
        postId,
        data,
        () => {
          alertService.info('comment posted');
          console.log('reload posts..');
          onSubmit();
        },
        (errorMessage) => alertService.error(errorMessage.caption),
      ),
    );
  };

  return (
    <Form
      onSubmit={handleSubmit(onSubmitLocal)}
      classNameExtra="feeds__new-message-message"
    >
      <FieldTextArea
        name="message"
        placeholder="Write your comment"
        validationError={errors.description}
        classNameExtra="squared"
        watch={watch}
        setFocus={setFocus}
        setValue={setValue}
        {...register('message', {
          required: true,
          minLength: 10,
        })}
      />
      <div className="publish__submit">
        <FormSubmit
          classNameExtra="btn--black btn btn--center"
          title="Publish"
          isSubmitting={isSubmitting}
        />
      </div>
    </Form>
  );
}
