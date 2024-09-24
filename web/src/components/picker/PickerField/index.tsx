import { Picker } from 'components/picker/Picker';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import FieldError from 'elements/Fields/FieldError';

export default function PickerField({
  validationError = null,
  label = '',
  btnLabel,
  explain = '',
  children,
  contentAligment = ContentAlignment.left,
  btnType = BtnType.splitIcon,
  showPopup,
  headerText = '',
  openPopup,
  closePopup,
  button = <Btn
  btnType={btnType}
  caption={btnLabel}
  contentAlignment={contentAligment}
  onClick={() => openPopup()}
/>
}) {

  return (
    <>
      <div className="form__field">
        <label
          className="form__label"
        >
          {label}
        </label>
        <p className="form__explain">{explain}</p>
        <FieldError validationError={validationError} />
        {button}
      </div>
      {showPopup && 
          <Picker closeAction={closePopup} headerText={headerText}>
          { children }
          </Picker>
        }
    </>
  );
}
