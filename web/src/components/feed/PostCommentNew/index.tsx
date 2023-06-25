import Btn, { BtnType } from 'elements/Btn';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';
import { ContentAlignment } from 'elements/ImageWrapper';
import t from 'i18n';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { CreateNewPostComment } from 'state/Posts';

export default function PostCommentNew({ postId, onSubmit }) {
  const {
    register,
    setValue,
    watch,
    setFocus,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmitLocal = (e) => {
    e.preventDefault()
    const data = getValues();
    console.log(data);
    console.log('submitting');
    store.emit(
      new CreateNewPostComment(
        postId,
        data,
        () => {
          alertService.info('comment posted');
          onSubmit();
        },
        (errorMessage) => alertService.error(errorMessage.caption),
      ),
    );
  };

  return (
    <Form
      onSubmit={onSubmitLocal}
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
        <Btn
                submit={true}
                btnType={BtnType.corporative}
                caption={t('post.newCommentSave')}
                contentAlignment={ContentAlignment.center}
              />
      </div>
    </Form>
  );
}
