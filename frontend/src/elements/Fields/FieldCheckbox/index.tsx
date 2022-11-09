import React from "react";
import CheckBox from 'elements/Checkbox'
import FieldError from "../FieldError";

export default function FieldCheckbox({
    label,
    value,
    handleChange,
    name,
    validationError
}) {
    return (
        <div className="form__field">
        <label className="label">{label}</label>
            <CheckBox icon="cross" name={name} value={value} handleChange={handleChange}/>
            <FieldError validationError={validationError}/>
        </div>
        
    );
}
