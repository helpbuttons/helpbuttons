import Btn, { BtnType, IconType } from 'elements/Btn';
import FieldText from 'elements/Fields/FieldText';
import { ContentAlignment } from 'elements/ImageWrapper';
import t from 'i18n';
import { useFieldArray, useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { IoAdd, IoPencilOutline, IoPowerOutline, IoSaveOutline, IoTrashBinOutline } from 'react-icons/io5';
import { useState, forwardRef, useEffect, useRef } from 'react';
import { FieldColorPick } from 'elements/Fields/FieldColorPick';
import { tagify } from 'shared/sys.helper';
import { buttonColorStyle } from 'shared/buttonTypes';
import { AddCustomFields } from '../CustomFields/AddCustomFields';
import { EmojiPicker } from 'components/emoji';
import { Picker } from 'components/picker/Picker';
import PickerField from 'components/picker/PickerField';


const FieldButtonTemplates = forwardRef(
  (
    {
      label,
      name,
      classNameInput,
      placeholder,
      onChange,
      onBlur,
      validationError,
      value,
      explain,
      errors,
      watch,
      control,
      register,
      setValue
    },
    ref,
  ) => {


    const { remove, append, update } = useFieldArray({
      name,
      control,
    });

    const [editFieldIdx, setEditFieldIdx] = useState(null)
    const [editFieldCaption, setEditFieldCaption] = useState(null)
    const [editFieldCssColor, setEditFieldCssColor] = useState(null)
    const [editFieldEmoji, setEditFieldEmoji] = useState('😀')
    const [hideField, setHideField] = useState(false)

    let closeMenu = () => {
      setEditFieldIdx(false);
    };

   
    const watchValue = watch(name);

    useEffect(() => {
      console.log(watchValue)
    }, [watchValue])
    const edit = (value, idx) => {
      setEditFieldIdx(() => idx)
      setEditFieldCssColor(() => value.cssColor)
      setEditFieldCaption(() => value.caption)
      setHideField(() => value.hide)
      if(value.icon)
      {
        setEditFieldEmoji(() => value.icon)
      }else{
        setEditFieldEmoji(() => '😀')
      }
    }

    const saveEdit = (value) => {
      update(editFieldIdx, {
        ...value, 
        icon: editFieldEmoji,
        cssColor: editFieldCssColor, 
        caption: editFieldCaption,
        hide: hideField
      })
      setEditFieldIdx(() => null)
      setEditFieldCssColor(() => null)
      setEditFieldCaption(() => null)
      setHideField(() => false)
    }

    const hideIdx = (id, values) => {
      update(id, {...values, hide: true})
    }

    const showIdx = (id, values) => {
      update(id, {...values, hide: false})
    }

    return (
      <>
        <div className="form__field">

            <div className="form__section-title">
              {t('configuration.buttonTemplateFormListTitle')}
            </div>
            <p className="form__explain">{t('configuration.buttonTemplateExplain')}</p>

        </div>  
        <div className="form__list--button-type-field">
          {watchValue?.length > 0 &&
            watchValue.map((val, idx) => (
              <div
                className="form__list-item--button-type-field"
                key={idx}
                style={buttonColorStyle(val.cssColor)}
              >
                {editFieldIdx == idx &&
                  <Picker closeAction={() => setEditFieldIdx(() => null)} headerText={t('configuration.setType')}>
                    <div className="form__button-type-section">
                      <FieldText
                        name="buttonTemplate.name"
                        label={t('configuration.buttonTemplateName')}
                        className="field-text"
                        onChange={(e) => setEditFieldCaption(() => e.target.value)}
                        defaultValue={editFieldCaption}
                      />
                      <EmojiPicker
                      updateEmoji={(newEmoji) => setEditFieldEmoji(() => newEmoji)} 
                      pickerEmoji={editFieldEmoji}
                      label={t('configuration.buttonTemplateEmoji')}
                      />
                      <FieldColorPick
                        name="buttonTemplateColor"
                        classNameInput="squared"
                        validationError={errors.buttonTemplateColor}
                        setValue={(name, value) => setEditFieldCssColor(value)}
                        label={t('configuration.buttonTemplateColor')}
                        actionName={t('configuration.buttonTemplateColor')}
                        value={editFieldCssColor}
                      />
                      <Btn
                        btnType={BtnType.corporative}
                        iconLink={<IoSaveOutline />}
                        iconLeft={IconType.circle}
                        contentAlignment={ContentAlignment.center}
                        onClick={() => saveEdit(val)}
                      />
                    </div>
                  </Picker>
                }
                {editFieldIdx != idx && 
                  <HiddenTemplate value={val.hide}>
                    <Btn
                      btnType={BtnType.filterEmoji}
                      iconLeft={IconType.svg}
                      contentAlignment={ContentAlignment.left}
                      caption={val.caption}
                      iconLink={val.icon}
                      color={val.cssColor}
                    />
                    <Btn
                      btnType={BtnType.iconActions}
                      iconLink={<IoPencilOutline />}
                      iconLeft={IconType.circle}
                      contentAlignment={ContentAlignment.center}
                      onClick={() => edit(val, idx)}
                    />
                    {!val.hide && 
                      <Btn
                        btnType={BtnType.iconActions}
                        iconLink={<IoTrashBinOutline />}
                        iconLeft={IconType.circle}
                        contentAlignment={ContentAlignment.center}
                        onClick={() => {
                          hideIdx(idx, val)
                      }}
                      />
                    }
                    {val.hide && 
                      <Btn
                        btnType={BtnType.smallCircle}
                        iconLink={<IoPowerOutline />}
                        iconLeft={IconType.circle}
                        contentAlignment={ContentAlignment.center}
                        onClick={() => {
                          showIdx(idx, val)
                        }}
                      />
                    }
                  </HiddenTemplate>
                } 
                
              </div>
            ))}
        </div>
        <ButtonTemplateForm label={label} explain={explain} append={append}/>
      </>
    );
  },
);

export default FieldButtonTemplates;

function HiddenTemplate({value, children}){
  if(value)
  {
    return <>{children}</>
  }
  return <>{children}</>
}

function ButtonTemplateForm({ label, explain, append }) {
  const { register, setValue, watch, getValues, reset } = useForm({
    defaultValues: {
      emoji: '😀',
      color: '#000',
      text: '',
      customFields: [],
    },
  });

  const onAddNewButtonTemplate = ({
    text,
    color,
    customFields,
    emoji,
  }) => {
    if (text && color) {
      append({
        caption: text,
        name: tagify(text),
        cssColor: color,
        customFields: customFields,
        icon: emoji,
      });
      alertService.warn(
        t('configuration.templateNewButtonTemplate', [text, emoji]),
      );
      closePopup()
      reset();
    } else {
      alertService.warn(t('configuration.templateMissingFields'));
    }
  };
  const [showForm, setShowForm] = useState(false)
  const [customFields, setCustomFields] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const closePopup = () => setShowPopup(() => false);
  const openPopup = () => setShowPopup(() => true);

  return (
      <PickerField btnType={BtnType.corporative} iconLeft={<IoAdd/>} label={''} explain={''} btnLabel={label} showPopup={showPopup} openPopup={openPopup} closePopup={closePopup}>
        {/* headerText={t('configuration.setType')} */}
        <>
        {/* <div className="form__input--button-type-field"></div> */}
        <div className="form__field">
          <div className="form__section-title">{label}</div>
          <p className="form__explain">{explain}</p>
        </div>
        <FieldText
          name={t('configuration.buttonTemplateName')}
          label={t('configuration.buttonTemplateName')}
          placeholder={t('configuration.createButtonTypePlaceholder')}
          className="field-text"
          // onChange={(e) => setValue('text', e.target.value)}
          {...register('text')}
        />
        <EmojiPicker
          updateEmoji={(newEmoji) => setValue('emoji', newEmoji)}
          pickerEmoji={watch('emoji')}
          label={t('configuration.buttonTemplateEmoji')}
        />
        <FieldColorPick
          name="buttonTemplateColor"
          classNameInput="squared"
          label={t('configuration.buttonTemplateColor')}
          // validationError={errors.color}
          setValue={(name, value) => setValue('color', value)}
          actionName={t('button.pickButtonTemplateColor')}
          value={watch('color')}
        />
        <label className="form__label">
          {t('configuration.customFields')}:
        </label>
        <p className="form__explain">
          {t('configuration.customFieldsExplain')}
        </p>
        <AddCustomFields
          customFields={customFields}
          setCustomFields={setCustomFields}
        />
        <Btn
          caption={t('configuration.addType')}
          onClick={() => onAddNewButtonTemplate(getValues())}
          btnType={BtnType.submit}
        />
        </>
      </PickerField>
      
  );
}