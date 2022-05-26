import React, { useState } from "react";

export default function FieldText({
    label,
    defaultvalue,
    handleChange,
    name,
    validationError,
    isNumber,
}) {
    // const [value, setValue] = useState();

    const onChange = (e) => {
        let valueToSend = e.target.value;
        if (isNumber) {
            valueToSend = e.target.valueAsNumber;
        }
        handleChange(name, valueToSend);
      };
    let attributes = {
        type: 'text',
    }
    if (isNumber) {
        attributes = {
            type: 'number',
            step: 'any'
        }
    }
    return (
        <div className="form__field">
        <label className="label">{label}</label>
            <input 
                      name={name} 
                      {...attributes}
                      onChange={onChange}
                      className={`form__input ${validationError ? 'validation-error' : ''}`} 
                    />
         {validationError}
        </div>
    );
}
