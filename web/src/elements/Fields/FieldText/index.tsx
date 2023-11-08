import React, { useState } from "react";
import FieldError from "../FieldError";

interface IFieldText {
    label: string,
    handleChange: Function,
    name: string,
    validationError: any,
    classNameInput?: string,
    placeholder?: string   
}

const FieldText = React.forwardRef(({
    label,
    name,
    classNameInput,
    placeholder,
    onChange,
    onBlur,
    validationError,
    value,
    explain,
    extraMessage,
    maxLength = -1
}, ref): IFieldText => {
    const [textLength, setTextLength] = useState(0);
    const onInput = (obj) => {
        if (maxLength > 0){
            if ( obj.target.value.length > maxLength) {
                obj.target.value = obj.target.value.slice(0, maxLength)
            }
            setTextLength(obj.target.value.length)
        } 
    }
    return (
        <div className="form__field">
            {label && <label className="form__label">{label}</label>}
            {explain && 
                <p className="form__explain">{explain}</p>
            }
            <input
                name={name} 
                ref={ref}
                type="text"
                placeholder={ placeholder ? placeholder : label}
                onChange={onChange}
                onBlur={onBlur}
                className={`form__input ${classNameInput} ${validationError ? 'validation-error' : ''}`} 
                value={value}
                onInput={onInput}
            />
            {maxLength > 0 && 
                <>{textLength} / {maxLength}</>
            }
            <div className="form__input-subtitle">
                <FieldError validationError={validationError} extraMessage={extraMessage}/>
            </div>
        </div>
    );
});

export default FieldText;

