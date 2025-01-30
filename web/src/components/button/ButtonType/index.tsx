//This is the first section in the button creation process, but can be displayed or not depending on the selected network settings. It displays the buttons types (default offer an need and exchange) and leads to ButtonNewData after selection
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import FieldError from 'elements/Fields/FieldError';
import FieldRadio from 'elements/Fields/FieldRadio';
import FieldRadioOption from 'elements/Fields/FieldRadio/option';
import React from 'react';
import { IoClose } from 'react-icons/io5';
import { buttonColorStyle } from 'shared/buttonTypes';
type IconType = 'cross' | 'red';

function RadioIcon({ icon }: { icon: IconType }) {
  switch (icon) {
    case 'cross':
      return (
        <div className="checkbox__icon">
          <IoClose />
        </div>
      );
    case 'red':
      return <div className="btn-filter__icon"></div>;
    default:
      return null;
  }
}

const FieldButtonType = React.forwardRef(
  ({ name, onChange, onBlur, validationError, label, explain, buttonTypes }, ref) => {
    return (
      <>
        <FieldRadio label={label} explain={explain}>
          {buttonTypes.map((buttonType, idx) => (
            <div key={idx}>
              <FieldRadioOption
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                ref={ref}
                value={buttonType.name}
                key={idx}
                color={buttonType.cssColor}
              >
                <ButtonType caption={buttonType.caption} emoji={buttonType.icon} color={buttonType.cssColor}/>
              </FieldRadioOption>
            </div>

          ))}
        </FieldRadio>
        <FieldError validationError={validationError} />
      </>
    );
  },
);

FieldButtonType.displayName = 'ButtonType';

export default FieldButtonType;


export function ButtonType({ caption, emoji, color }) {
  return (<><div className="btn-with-icon__emoji">{emoji}</div>
    <div className="btn-with-icon__text">{caption}</div></>)
}