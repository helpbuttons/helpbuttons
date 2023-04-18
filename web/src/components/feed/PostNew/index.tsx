import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';
import t from 'i18n';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { alertService } from 'services/Alert';
import { CreateNewPost } from 'state/Posts';

export default function PostNew({ buttonId, reloadPosts }) {
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
      new CreateNewPost(
        buttonId,
        {message: data.message},
        () => {
          alertService.info(t('common.saveSuccess', ['post']));
          setValue('message', '')
          reloadPosts()
        },
        (errorMessage) => alertService.error(errorMessage.caption),
      ),
    );
  };

  return (
    <>
      <div className="button-file__action-section">
        <div className="button-file__action-section--field">
          <Form
            onSubmit={handleSubmit(onSubmitLocal)}
            classNameExtra="feeds__new-message"
          >
            <div className="feeds__new-message-message">
              <FieldTextArea
                name="title"
                label={t('post.write')}
                placeholder={t('post.placeholderWrite')}
                validationError={errors.title}
                watch={watch}
                setValue={setValue}
                setFocus={setFocus}
                {...register('message', { required: true })}
              />
            </div>
            <button type="submit" className="btn-circle btn-circle__icon btn-circle__content">
              <IoPaperPlaneOutline />
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
