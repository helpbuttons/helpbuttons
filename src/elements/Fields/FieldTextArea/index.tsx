import FieldError from "../FieldError";

export default function FieldText({
  label,
  handleChange,
  name,
  validationError,
  placeholder,
}) {
  const onChange = (e) => {
    handleChange(name, e.target.value);
  };

  return (
    <>
      <div className="form__field">
        <p className="popup__paragraph">{label}</p>

        <textarea
          onChange={onChange}
          name={name}
          className="textarea__textarea"
          placeholder={placeholder}
        ></textarea>
        <FieldError validationError={validationError} />
      </div>
    </>
  );
}
