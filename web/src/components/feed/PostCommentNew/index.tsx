import Btn, { BtnType } from 'elements/Btn';
import FieldText from 'elements/Fields/FieldText';
import Form from 'elements/Form';
import { ContentAlignment } from 'elements/ImageWrapper';
import t from 'i18n';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { CreateNewPostComment } from 'state/Posts';
import { IoPaperPlaneOutline } from 'react-icons/io5';

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
              classNameExtra="feeds__new-message"
            >
              <div className="feeds__new-message-message">
                <FieldText
                  name="message"
                  placeholder={t('comment.placeholderWrite')}
                  validationError={errors.description}
                  watch={watch}
                  setValue={setValue}
                  setFocus={setFocus}
                  {...register('message', { 
                    required: true, 
                    minLength: 10,
                  })}
                />
              </div>
              <button type="submit" className="btn-circle btn-circle__icon btn-circle__content">
                <IoPaperPlaneOutline />
              </button>
            </Form>
  );
}
