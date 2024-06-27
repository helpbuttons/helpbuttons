import { Picker } from 'components/picker/Picker';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import FieldError from 'elements/Fields/FieldError';

export default function PickerField({
  validationError = null,
  label = '',
  btnLabel,
  explain = '',
  children,
  btnType = BtnType.splitIcon,
  showPopup,
  headerText = '',
  openPopup,
  closePopup
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
        <Btn
              btnType={btnType}
              caption={btnLabel}
              contentAlignment={ContentAlignment.left}
              onClick={() => openPopup()}
          />
      </div>
      {showPopup && 
          <Picker closeAction={closePopup} headerText={headerText}>
          { children }
          </Picker>
        }
    </>
  );
}
