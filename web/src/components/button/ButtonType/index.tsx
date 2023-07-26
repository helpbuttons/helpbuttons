//This is the first section in the button creation process, but can be displayed or not depending on the selected network settings. It displays the buttons types (default offer an need and exchange) and leads to ButtonNewData after selection
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
      return <div className="btn-filter__icon red"></div>;
    default:
      return null;
  }
}

const ButtonType = React.forwardRef(
  ({ name, onChange, onBlur, validationError, label, explain, buttonTypes }, ref) => {
    return (
      <>
        <FieldRadio label={label} explain={explain}>
          {buttonTypes.map((buttonType, idx) => (
            <div key={idx} style={buttonColorStyle(buttonType.cssColor)}>
              <FieldRadioOption
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                ref={ref}
                value={buttonType.name}
                key={idx}
              >
              <div className="btn-filter__icon"></div>
              <div className="btn-with-icon__text">{buttonType.caption}</div>
              </FieldRadioOption>
            </div>
            
          ))}
        </FieldRadio>
        <FieldError validationError={validationError} />
      </>
    );
  },
);

ButtonType.displayName = 'ButtonType';

export default ButtonType;
