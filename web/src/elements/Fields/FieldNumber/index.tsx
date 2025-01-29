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
    explain,
    extraMessage
}, ref): IFieldText => {
    return (
        <div className="form__field">
            <label className="form__label">{label}</label>
            {explain &&
                <p className="form__explain">{explain}</p>
            }
            <InputNumber name={name} classNameInput={`form__input__field ${classNameInput}`} placeholder={placeholder} onChange={onChange} onBlur={onBlur} validationError={validationError}
            value={value} extraMessage={extraMessage}/>
        </div>
    );
});

export default FieldNumber;



export const InputNumber = React.forwardRef(({
    name,
    classNameInput = '',
    placeholder = '',
    onChange = () => {},
    onBlur = () => {},
    validationError,
    value,
    extraMessage
}, ref) => {
    return (<><input
        name={name}
        ref={ref}
        type="number"
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        className={`form__input ${classNameInput} ${validationError ? 'validation-error' : ''}`}
        value={value}
        step="any"
    />
        <div className="form__input-subtitle">
            <FieldError validationError={validationError} extraMessage={extraMessage} />
        </div></>)

})