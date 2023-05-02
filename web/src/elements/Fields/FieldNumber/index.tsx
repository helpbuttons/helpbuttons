import FieldError from "../FieldError";

export default function FieldNumber({
    label,
    handleChange = (e,v) => {},
    name,
    validationError,
    value,
}) {
    const onChange = (e) => {
        handleChange(name, e.target.valueAsNumber);
      };

    return (
        <div className="form__field">
        <label className="label">{label}</label>
            <input 
                      name={name} 
                      type="number"
                      step="any"
                      onChange={onChange}
                      className={`form__input ${validationError ? 'validation-error' : ''}`} 
                      value={value}
                    />
         <FieldError validationError={validationError}/>
        </div>
    );
}
