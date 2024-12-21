import React from "react";
import FieldError from "../FieldError";

const FieldNumber = React.forwardRef(({
    label,
    name,
    classNameInput,
    placeholder,
    onChange,
    onBlur,
    validationError,
    value,
    extraClass,
    explain,
    extraMessage
}, ref): IFieldText => {
    return (
        <div className={"form__field" + ' ' + extraClass}>
            {label && 
                <label className="form__label">{label}</label>
            }
            {explain && 
                <p className="form__explain">{explain}</p>
            }
            <input
                name={name} 
                ref={ref}
                type="number"
                placeholder={ placeholder ? placeholder : label}
                onChange={onChange}
                onBlur={onBlur}
                className={`form__input ${classNameInput} ${validationError ? 'validation-error' : ''}`} 
                value={value}
                step="any"
            />
            <div className="form__input-subtitle">
                <FieldError validationError={validationError} extraMessage={extraMessage}/>
            </div>
        </div>
    );
});

export default FieldNumber;