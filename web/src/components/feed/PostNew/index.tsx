import Form from 'elements/Form';
import FormSubmit from 'elements/Form/FormSubmit';
import t from 'i18n';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { alertService } from 'services/Alert';
import { CreateNewPost } from 'state/Posts';

export default function PostNew({ buttonId }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log('fuuck');
    console.log(data);
    store.emit(new CreateNewPost(
      buttonId,
      data,
      () => {console.log('yeaaah')},
      (errorMessage) => alertService.error(errorMessage)
    ));
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        classNameExtra="feeds__new-message"
      >
        <div className="feeds__new-message-message">
          <input
            placeholder={t('feed.write')}
            className="form__input feeds__new-message-input"
            {...register('message', {
              required: true,
              minLength: 10,
            })}
          ></input>
        </div>
        <button type="submit" className="btn-circle">
          <div className="btn-circle__content">
            <div className="btn-circle__icon">
              <IoPaperPlaneOutline />
            </div>
          </div>
        </button>
      </Form>
    </>
  );
}
