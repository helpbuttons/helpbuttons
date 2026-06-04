import { Picker } from 'components/picker/Picker';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import FieldError from 'elements/Fields/FieldError';

export default function PickerField({
  validationError = null,
  label = '',
  btnLabel,
  explain = '',
  children,
  contentAligment = ContentAlignment.left,
  btnType = BtnType.searchPickerField,
  iconLeft= IconType.svg,
  showPopup,
  headerText = '',
  openPopup,
  iconLink = null,
  closePopup,
  button = <Btn
    btnType={btnType}
    caption={btnLabel}
    iconLink= {iconLink}
    iconLeft={iconLeft}
    contentAlignment={contentAligment}
    onClick={() => openPopup()}
  />
}) {

  return (
      <div className="form__field">
        <label
          className="form__label"
        >
          {label}
        </label>
        <p className="form__explain">{explain}</p>
        {button}
        {showPopup &&
        <Picker closeAction={closePopup} headerText={headerText}>
          {children}
        </Picker>
         }
        <FieldError validationError={validationError} />
      </div>  
  );
}
