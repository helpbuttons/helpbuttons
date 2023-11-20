import Btn, { BtnType, IconType } from 'elements/Btn';
import FieldText from 'elements/Fields/FieldText';
import { ContentAlignment } from 'elements/ImageWrapper';
import t from 'i18n';
import { useFieldArray, useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { IoTrashBinOutline } from 'react-icons/io5';
import { useState, forwardRef, useEffect } from 'react';
import { CircleColorPick, FieldColorPick } from 'elements/Fields/FieldColorPick';
import { tagify } from 'shared/sys.helper';
import { buttonColorStyle } from 'shared/buttonTypes';
import Accordion from 'elements/Accordion';
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

    const { remove, append } = useFieldArray({
      name,
      control,
    });

    const [customFields, setCustomFields] = useState([]);

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
{/* 
          <CircleColorPick
            name="buttonTemplateColor"
            classNameInput="squared"
            validationError={errors.buttonTemplateColor}
            setValue={(name, value) => setColor(value)}
            actionName={t('button.pickButtonTemplateColor')}
            value={color}
            hideBoilerPlate={true}
          /> */}
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
                <Btn
                  btnType={BtnType.filter}
                  iconLeft={IconType.color}
                  contentAlignment={ContentAlignment.left}
                  caption={val.caption}
                  color={val.cssColor}
                />
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
