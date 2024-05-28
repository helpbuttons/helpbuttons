import { Picker } from 'components/picker/Picker';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import FieldError from 'elements/Fields/FieldError';

export default function PopupForm({
  validationError = null,
  label,
  btnLabel,
  explain = '',
  children,
  showPopup,
  headerText = '',
  openPopup,
  closePopup
}) {
  return (
    <>
      <div className="form__field">
        <div
          className="form__label"
        >
          {label}
        </div>
        <div className="form__explain">{explain}</div>
        <FieldError validationError={validationError} />
        <Btn
              btnType={BtnType.splitIcon}
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
