import Btn, { BtnType, IconType } from 'elements/Btn';
import FieldText from 'elements/Fields/FieldText';
import { ContentAlignment } from 'elements/ImageWrapper';
import t from 'i18n';
import { useFieldArray } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { IoTrashBinOutline } from 'react-icons/io5';
import { useState, forwardRef } from 'react';
import { CircleColorPick } from 'elements/Fields/FieldColorPick';
import { tagify } from 'shared/sys.helper';
import { buttonColorStyle } from 'shared/buttonTypes';

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
    },
    ref,
  ) => {
    const [color, setColor] = useState();
    const [text, setText] = useState();

    const { remove, append } = useFieldArray({
      name,
      control,
    });
    
    const watchValue = watch(name);
    const onAddNewButtonTemplate = (data) => {
      if (text && color) {
        append({
          caption: text,
          name: tagify(text),
          cssColor: color,
        });
      } else {
        alertService.warn(
          'You need to pick a color and add a name before adding a new template button',
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

          <CircleColorPick
            name="buttonTemplateColor"
            classNameInput="squared"
            validationError={errors.buttonTemplateColor}
            setValue={(name, value) => setColor(value)}
            actionName={t('button.pickButtonTemplateColor')}
            value={color}
            hideBoilerPlate={true}
          />

        </div>
        <Btn  
            caption={'+ Add type'}
            onClick={() => onAddNewButtonTemplate(watch())}
            btnType={BtnType.corporative}
          />

        <div className='form__list--button-type-field'>
        
          {watchValue?.length > 0 &&
            watchValue.map((val, idx) => (
              <div className='form__list-item--button-type-field' key={idx} style={buttonColorStyle(val.cssColor)}>
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
