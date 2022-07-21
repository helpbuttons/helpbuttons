import FieldError from "../FieldError";

interface FieldText {
  label: string,
  handleChange: Function,
  name: string,
  validationError: any,
  placeholder: string,
  classNameExtra?: string
}

export default function FieldText({
  label,
  handleChange,
  name,
  validationError,
  placeholder,
  classNameExtra
}: FieldText) {
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
          className={`${classNameExtra} textarea__textarea`}
          placeholder={placeholder}
        ></textarea>
        <FieldError validationError={validationError} />
      </div>
    </>
  );
}
