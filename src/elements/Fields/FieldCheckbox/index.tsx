import React from "react";
import CheckBox from 'elements/Checkbox'

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
         {validationError}
        </div>
        
    );
}
