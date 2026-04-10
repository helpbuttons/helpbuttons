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
import { Picker, PickerConfirmation } from 'components/picker/Picker';
import PickerField from 'components/picker/PickerField';
import { DeleteButtonsType, useSelectedNetwork } from 'state/Networks';
import { store } from 'state';
import { customTemplateIcon } from 'components/templates';


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

    const editingDefaultValue = {
      id: null,
      icon: '😀',
      cssColor: null, 
      caption: '',
      hide: false,
      customFields: null
    };
    const [editingValue, setEditingValue] = useState(editingDefaultValue)
   
    const watchValue = watch(name);
    const openToEdit = (value, idx) => {
      setEditingValue(() => {return {id: idx, ...value}})
    }
    const setEditing = (keyValue) => {
      setEditingValue((prevValues) => {return {...prevValues, ...keyValue}})
    }
    const saveEdit = (value) => {
      update(editingValue.id, {...value,...editingValue})
      cancelEdit()
    }
    const cancelEdit = () => {
      setEditingValue(() => editingDefaultValue)
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
                key={idx}
                className="form__list-item--button-type-field"
                style={buttonColorStyle(val.cssColor)}>
                {editingValue?.id == idx &&
                  <EditButtonTemplate cancelEdit={cancelEdit} setEditing={setEditing} editingValue={editingValue} errors={errors} saveEdit={saveEdit} remove={remove} defaultValue={val} />
                }

                <Btn
                  btnType={BtnType.filterEmoji}
                  iconLeft={IconType.svg}
                  contentAlignment={ContentAlignment.left}
                  caption={val.caption}
                  iconLink={val.icon}
                  color={val.cssColor}
                  onClick={() => openToEdit(val, idx)}
                />


                <div className='form__list-item__actions'>
                  {val?.customFields && val.customFields.map((field,idx) => { return <span className='btn-circle__icon' key={idx}>{customTemplateIcon(field.type)}</span> })}

                  <Btn
                    btnType={BtnType.iconActions}
                    iconLink={<IoPencilOutline />}
                    iconLeft={IconType.circle}
                    contentAlignment={ContentAlignment.center}
                    onClick={() => openToEdit(val, idx)}
                  />
                </div>
              </div>
            ))}
        </div>
        <ButtonTemplateForm buttonTemplates={watchValue} label={label} explain={explain} append={append}/>
      </>
    );
  },
);

export default FieldButtonTemplates;

function ButtonTemplateForm({ label, explain, append, buttonTemplates }) {
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
      let _name = tagify(text);
      while(buttonTemplates.filter((_val) => _val.name == _name).length > 0){
          _name = _name + '_'
      }
      append({
        caption: text,
        name: _name,
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
  // const [customFields, setCustomFields] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const closePopup = () => setShowPopup(() => false);
  const openPopup = () => setShowPopup(() => true);
  const customFields = watch('customFields')
  return (
      <PickerField btnType={BtnType.corporative}  iconLeft={IconType.svg} iconLink={<IoAdd/>} label={''} explain={''} btnLabel={label} showPopup={showPopup} openPopup={openPopup} closePopup={closePopup}>
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
          // onChange={(e) => setValue('text', e.target.value)}
          {...register('text')}
        />
        <EmojiPicker
          updateEmoji={(newEmoji) => setValue('emoji', newEmoji)}
          pickerEmoji={watch('emoji')}
          label={t('configuration.buttonTemplateEmoji')}
          explain={''}
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
        {customFields && 
          <AddCustomFields
            selectedCustomTemplates={customFields}
            setSelectedCustomTemplates={(_customFields) => setValue('customFields', _customFields)}
            setEditing={null}
            editingValue={watch}
          />
        }
        <Btn
          caption={t('configuration.addType')}
          iconLeft={IconType.svg}
          iconLink={<IoAdd/>}
          contentAlignment={ContentAlignment.center}
          onClick={() => onAddNewButtonTemplate(getValues())}
          btnType={BtnType.submit}
        />
        </>
      </PickerField>
      
  );
}

function EditButtonTemplate({cancelEdit, setEditing, editingValue, errors, saveEdit, remove, defaultValue}) {
  const selectedNetwork = useSelectedNetwork()

  const [showConfirmation, setShowConfirmation] = useState(false) 
  const removeIdx = () => {
    const buttonCount = selectedNetwork.buttonTypesCount.find((elem) => elem.type == editingValue.name)?.count

    if(buttonCount > 0){
      setShowConfirmation(() => true)
    }else{
      remove(editingValue.id)
      cancelEdit()
    }
  }

  const onDeleteConfirm = () => {
    store.emit(new DeleteButtonsType(editingValue.name, () => {
      remove(editingValue.id)
      cancelEdit()
    }))
    setShowConfirmation(() => false)
  }

  const onDeleteCancel = () => {
    setShowConfirmation(() => false)
    cancelEdit()
  }

  return (
    <Picker closeAction={cancelEdit} headerText={t('configuration.setType')}>
      <div className="form__button-type-section">
        <FieldText
          name="buttonTemplate.name"
          label={t('configuration.buttonTemplateName')}
          className="field-text"
          onChange={(e) => setEditing({ caption: e.target.value })}
          defaultValue={editingValue.caption}
        />
        <EmojiPicker
          updateEmoji={(newEmoji) => setEditing({ icon: newEmoji })}
          pickerEmoji={editingValue.icon}
          label={t('configuration.buttonTemplateEmoji')}
        />
        <FieldColorPick
          name="buttonTemplateColor"
          classNameInput="squared"
          validationError={errors.buttonTemplateColor}
          setValue={(name, value) => setEditing({ cssColor: value })}
          label={t('configuration.buttonTemplateColor')}
          actionName={t('configuration.buttonTemplateColor')}
          value={editingValue.cssColor}
        />

        {editingValue?.customFields &&
          <>
            <label className="form__label">
              {t('configuration.customFields')}:
            </label>
            <p className="form__explain">
              {t('configuration.customFieldsExplain')}
            </p>
            <AddCustomFields
              selectedCustomTemplates={editingValue.customFields}
              setSelectedCustomTemplates={(customFields) => setEditing({ customFields: customFields })}
              setEditing={setEditing}
              editingValue={editingValue}
              saveEdit={saveEdit}
            />
          </>
        }
        <div className='form__field--multiinput'>
          <Btn
            btnType={BtnType.submit}
            iconLeft={IconType.svg}
            caption={t('common.save')}
            contentAlignment={ContentAlignment.center}
            onClick={() => saveEdit(defaultValue)}
          />
          <Btn
            btnType={BtnType.splitIcon}
            iconLeft={IconType.svg}
            caption={t('common.delete')}
            contentAlignment={ContentAlignment.center}
            onClick={() => removeIdx()}
          />
        </div>
      </div>
      {showConfirmation && 
        <PickerConfirmation onCancel={onDeleteCancel} onConfirmation={onDeleteConfirm} title={t('customFields.confirmDeleteLabel')}>
          <div className='form__field'>
            {/* <div className="form__label"> {t('customFields.confirmDeleteLabel')}</div> */}
           <div className="form__explain"> {t('customFields.confirmDeleteExplain')}</div>
          </div>
          
        </PickerConfirmation>
      }
    </Picker>
      
  )
}