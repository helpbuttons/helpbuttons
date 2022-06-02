import FieldError from "../FieldError";

export default function FieldText({
    label,
    handleChange,
    name,
    validationError,
}) {
    const onChange = (e) => {
        handleChange(name, e.target.value);
      };

    return (
        <div className="form__field">
        <label className="label">{label}</label>
            <input 
                      name={name} 
                      type="text"
                      onChange={onChange}
                      className={`form__input ${validationError ? 'validation-error' : ''}`} 
                    />
            <FieldError validationError={validationError}/>
        </div>
    );
}
