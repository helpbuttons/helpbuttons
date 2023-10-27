import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';
import t from 'i18n';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { uniqueArray } from 'shared/sys.helper';

export default function MessageNew({
  onCreate,
  mentions = [],
  privateMessage = false,
  isComment = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { message: '' } });

  const onSubmitLocal = (data) => {
    setValue('message', '');
    onCreate(data.message);
  };

  useEffect(() => {
    if (mentions.length > 0) {
      mentions = uniqueArray(mentions);
      setValue(
        'message',
        mentions.reduce(
          (strOut, mention) => strOut + `@${mention} `,
          '',
        ),
      );
    }
  }, [mentions]);

  useEffect(() => {
    setFocus('message')
  }, [])
  return (
    <>
      <div className="button-file__action-section--field">
        <Form
          onSubmit={handleSubmit(onSubmitLocal)}
          classNameExtra="feeds__new-message"
        >
          <div className="feeds__new-message-message">
            <FieldTextArea
              name="message"
              setValue={setValue}
              placeholder={
                isComment
                  ? t('comment.placeholderWrite')
                  : t('post.placeholderWrite')
              }
              validationError={errors.message}
              {...register('message', { required: true })}
              maxLength={255}
            />
            {privateMessage && (
              <div className="form__input-subtitle-side">
                <label className="form__input-subtitle--error">
                  private
                </label>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn-circle btn-circle__icon btn-circle__content"
          >
            <IoPaperPlaneOutline />
          </button>
        </Form>
      </div>
    </>
  );
}
