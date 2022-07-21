import React from "react";
import FieldError from "../FieldError";

interface  FieldPassword {
    label: string,
    handleChange: Function,
    name: string,
    validationError: any,
    classNameInput?: string,
    placeholder?: string   
}

export default function FieldPassword({
    label,
    handleChange,
    name,
    validationError,
    classNameInput,
    placeholder
}: FieldPassword) {
    const onChange = (e) => {
        handleChange(name, e.target.value);
      };

    return (
        <div className="form__field">
            <label className="label">{label}</label>
            <input 
                name={name} 
                type="password"
                onChange={onChange}
                className={`form__input ${classNameInput} ${validationError ? 'validation-error' : ''}`} 
                placeholder={placeholder}
            />
            <FieldError validationError={validationError}/>
        </div>
    );
}
