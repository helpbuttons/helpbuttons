import FieldError from "../FieldError";
interface  FieldText {
    label: string,
    handleChange: Function,
    name: string,
    validationError: any,
    classNameInput?: string,
    placeholder?: string   
}

export default function FieldText({
    label,
    handleChange,
    name,
    validationError,
    classNameInput,
    placeholder
}: FieldText) {
    const onChange = (e) => {
        handleChange(name, e.target.value);
      };

    return (
        <div className="form__field">
            <label className="label">{label}</label>
            <input
                placeholder={placeholder}
                name={name} 
                type="text"
                onChange={onChange}
                className={`form__input ${classNameInput} ${validationError ? 'validation-error' : ''}`} 
            />
            <FieldError validationError={validationError}/>
        </div>
    );
}
