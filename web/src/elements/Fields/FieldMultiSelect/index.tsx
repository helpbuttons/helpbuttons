import React from "react";
import FieldError from "../FieldError";

export default function FieldMultiSelect({
    label,
    explain,
    children,
    validationError
}) {
    return (
        <div className="form__field">
            <label className="form__label">{label}</label>
            <p className="form__explain">{explain}</p>
            <div>{children}</div>
            <FieldError validationError={validationError}/>
        </div>
        
    );
}