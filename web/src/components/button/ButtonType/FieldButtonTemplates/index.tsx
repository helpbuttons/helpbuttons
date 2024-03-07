import Btn, { BtnType, IconType } from 'elements/Btn';
import FieldText from 'elements/Fields/FieldText';
import { ContentAlignment } from 'elements/ImageWrapper';
import t from 'i18n';
import { useFieldArray, useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { IoPencilOutline, IoSaveOutline, IoTrashBinOutline } from 'react-icons/io5';
import { useState, forwardRef, useEffect } from 'react';
import { CircleColorPick, FieldColorPick } from 'elements/Fields/FieldColorPick';
import { tagify } from 'shared/sys.helper';
import { buttonColorStyle } from 'shared/buttonTypes';
import { AddCustomFields } from '../CustomFields/AddCustomFields';

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
    },
    ref,
  ) => {
    const [color, setColor] = useState();
    const [text, setText] = useState();

    const { remove, append, update } = useFieldArray({
      name,
      control,
    });

    const [customFields, setCustomFields] = useState([]);
    const [editFieldIdx, setEditFieldIdx] = useState(null)
    const [editFieldCaption, setEditFieldCaption] = useState(null)
    const [editFieldCssColor, setEditFieldCssColor] = useState(null)
    
    const watchValue = watch(name);
    const onAddNewButtonTemplate = () => {
      if (text && color) {
        append({
          caption: text,
          name: tagify(text),
          cssColor: color,
          customFields: customFields
        });
      } else {
        alertService.warn(
          t('configuration.templateMissingFields'),
        );
      }
    };

    const edit = (value, idx) => {
      setEditFieldIdx(() => idx)
      setEditFieldCssColor(() => value.cssColor)
      setEditFieldCaption(() => value.caption)
    }

    const saveEdit = (value) => {
      update(editFieldIdx, {
        ...value, 
        cssColor: editFieldCssColor, 
        caption: editFieldCaption
      })
      setEditFieldIdx(() => null)
      setEditFieldCssColor(() => null)
      setEditFieldCaption(() => null)
    }

    return (
      <div className="form__field">
        <label className="form__label">{label}</label>
        <p className="form__explain">{explain}</p>

        <div className="form__input--button-type-field">
          <FieldText
            name="buttonTemplate.name"
            placeholder={t(
              'configuration.createButtonTypePlaceholder',
            )}
            className="field-text"
            onChange={(e) => setText(() => e.target.value)}
          />
          <FieldColorPick
                name="buttonTemplateColor"
                classNameInput="squared"
                validationError={errors.buttonTemplateColor}
                setValue={(name, value) => setColor(value)}
                actionName={t('button.pickButtonTemplateColor')}
                value={color}
                hideBoilerPlate={true}
            />
            <label className="form__label">{t('configuration.customFields')}:</label>
            <AddCustomFields
              setCustomFields={setCustomFields}
            />
            <Btn
              caption={t('configuration.addType')}
              onClick={() => onAddNewButtonTemplate()}
              btnType={BtnType.corporative}
            />
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
                  <>
                    <FieldText
                      name="buttonTemplate.name"
                      className="field-text"
                      onChange={(e) => setEditFieldCaption(() => e.target.value)}
                      defaultValue={editFieldCaption}
                    />
                    <CircleColorPick
                      name="buttonTemplateColor"
                      classNameInput="squared"
                      validationError={errors.buttonTemplateColor}
                      setValue={(name, value) => setEditFieldCssColor(value)}
                      actionName={t('button.pickButtonTemplateColor')}
                      value={editFieldCssColor}
                      hideBoilerPlate={true}
                    />
                    {/* <EmojiPicker/> */}
                    <Btn
                      btnType={BtnType.iconActions}
                      iconLink={<IoSaveOutline />}
                      iconLeft={IconType.circle}
                      contentAlignment={ContentAlignment.center}
                      onClick={() => saveEdit(val)}
                    />
                  </>
                }
                {editFieldIdx != idx && 
                  <>
                    <Btn
                      btnType={BtnType.filter}
                      iconLeft={IconType.color}
                      contentAlignment={ContentAlignment.left}
                      caption={val.caption}
                      color={val.cssColor}
                    />
                    <Btn
                      btnType={BtnType.iconActions}
                      iconLink={<IoPencilOutline />}
                      iconLeft={IconType.circle}
                      contentAlignment={ContentAlignment.center}
                      onClick={() => edit(val, idx)}
                    />
                  </>
                } 
                
                <Btn
                  btnType={BtnType.iconActions}
                  iconLink={<IoTrashBinOutline />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.center}
                  onClick={() => remove(idx)}
                />
              </div>
            ))}
        </div>
      </div>
    );
  },
);

export default FieldButtonTemplates;
