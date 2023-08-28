import FieldText from 'elements/Fields/FieldText';
import Form from 'elements/Form';
import t from 'i18n';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IoPaperPlaneOutline } from 'react-icons/io5';
import { uniqueArray } from 'shared/sys.helper';


export default function MessageNew({ onCreate, mentions = [], privateMessage = false }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmitLocal = (data) => {
    setValue('message', '')
    onCreate(data.message)
  };

  useEffect(() => {
    if(mentions.length > 0)
    {
      mentions = uniqueArray(mentions)
      setValue('message', mentions.reduce((strOut, mention) => strOut + `@${mention} `, ''))  
    }else{
      setValue('message', '')
    }
  }, [mentions])
  
  
  return (
    <>
      <div className="button-file__action-section">
        <div className="button-file__action-section--field">
          <Form
            onSubmit={handleSubmit(onSubmitLocal)}
            classNameExtra="feeds__new-message"
          >
            <div className="feeds__new-message-message">
              <FieldText
                name="title"
                placeholder={t('post.placeholderWrite')}
                validationError={errors.title}
                watch={watch}
                setValue={setValue}
                setFocus={setFocus}
                {...register('message', { required: true })}
              />
            </div>
            {privateMessage && 
            <span style={{ color: 'red' }}>private</span>}
            <button type="submit" className="btn-circle btn-circle__icon btn-circle__content">
              <IoPaperPlaneOutline />
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
