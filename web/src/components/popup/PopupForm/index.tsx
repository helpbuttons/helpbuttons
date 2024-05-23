import { Picker } from 'components/picker/Picker';
import FieldError from 'elements/Fields/FieldError';

export default function PopupForm({
  validationError = null,
  label,
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
          className="btn"
          onClick={() => openPopup()}
        >
          {label}
        </div>
        <div className="form__explain">{explain}</div>
        <FieldError validationError={validationError} />
      </div>
      {showPopup && 
      <>
        <Picker closeAction={closePopup} headerText={headerText}>
        { children }</Picker>
        </>
        }
    </>
  );
}
