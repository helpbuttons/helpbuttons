import React from "react";
import CheckBox from 'elements/Checkbox'
import FieldError from "../FieldError";

export default function FieldCheckbox({
    label,
    explain,
    children,
    validationError
}) {
    return (
        <div className="form__field">
            <p className="form__label">{label}</p>
            <p className="form__explain">{explain}</p>
            <div>{children}</div>
            {/* <CheckBox icon="cross" name={name} value={value} handleChange={handleChange}/> */}
            <FieldError validationError={validationError}/>
        </div>
        
    );
}
