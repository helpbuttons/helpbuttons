import Form from 'elements/Form';
import t from 'i18n';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { alertService } from 'services/Alert';
import { CreateNewPost } from 'state/Posts';

export default function PostNew({ buttonId, onSubmit }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmitLocal = (data) => {
    console.log('submitted')
    store.emit(
      new CreateNewPost(
        buttonId,
        data,
        () => {
          alertService.info('message posted');
          setValue('message', '')
          onSubmit()
        },
        (errorMessage) => alertService.error(errorMessage),
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
              <input
                placeholder={t('feed.write')}
                className="form__input feeds__new-message-input"
                {...register('message', {
                  required: true,
                  minLength: 10,
                })}
              ></input>
            </div>
            <button type="submit" onClick={onSubmitLocal} className="btn-circle btn-circle__icon btn-circle__content">
              <IoPaperPlaneOutline />
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
