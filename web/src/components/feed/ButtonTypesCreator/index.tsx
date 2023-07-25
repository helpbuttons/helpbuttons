import Btn, { BtnType, IconType } from 'elements/Btn';
import FieldText from 'elements/Fields/FieldText';
import Form from 'elements/Form';
import { ContentAlignment } from 'elements/ImageWrapper';
import t from 'i18n';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { CreateNewPostComment } from 'state/Posts';
import { IoPaperPlaneOutline, IoTrashBinOutline } from 'react-icons/io5';

export default function ButtonTypesSelector({ postId, onSubmit, label, explain }) {
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

            <div className="form__field">


              <label className="form__label">{label}</label>
              <p className="form__explain">{explain}</p>
              <Btn caption={t('configuration.createButtonTypeAction')} />

                <div className="form__input--button-type-field">

                  <FieldText
                    name="buttonTypesCreate"
                    placeholder={t('configuration.createButtonTypePlaceholder')}
                    validationError={errors.description}
                    watch={watch}
                    className="field-text"
                    setValue={setValue}
                    setFocus={setFocus}
                    {...register('message', { 
                      required: true, 
                      minLength: 10,
                    })}
                  />

                  <Btn
                    submit={true}
                    btnType={BtnType.circle}
                    iconLeft={IconType.red}
                    contentAlignment={ContentAlignment.left}
                    onClick={() => console.log('select color clicked')}
                  />

                  <Btn
                    submit={true}
                    btnType={BtnType.iconActions}
                    iconLink={<IoTrashBinOutline/>}
                    iconLeft={IconType.circle}
                    contentAlignment={ContentAlignment.center}
                    onClick={() => console.log('Trash bin icon clicked!')}
                  />
                </div>

            </div>
  );
}
