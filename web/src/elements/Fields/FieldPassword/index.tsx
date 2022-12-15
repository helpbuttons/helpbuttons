import React from "react";
import FieldError from "../FieldError";

interface IFieldPassword {
    label: string,
    handleChange: Function,
    name: string,
    validationError: any,
    classNameInput?: string,
    placeholder?: string   
}

const FieldPassword = React.forwardRef(({
    label,
    name,
    classNameInput,
    placeholder,
    onChange,
    onBlur,
    validationError,
}, ref): IFieldPassword => {
    return (
        <div className="form__field">
            <label className="label">{label}</label>
            <input
                name={name}
                ref={ref}
                type="password"
                onChange={onChange}
                onBlur={onBlur}
                className={`form__input ${classNameInput} ${validationError ? 'validation-error' : ''}`} 
                placeholder={placeholder ? placeholder : label}
            />
            <FieldError validationError={validationError}/>
        </div>
    );
});

export default FieldPassword;
