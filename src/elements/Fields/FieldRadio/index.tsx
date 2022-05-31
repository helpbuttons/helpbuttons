import React from "react";
import FieldError from "../FieldError";

export default function FieldRadio({
    children,
    label,
    validationError
}) {
    return (
        <>
        <div className="form__field">

          <p className="popup__paragraph">
            {label}
          </p>
          {children}
          
        <FieldError validationError={validationError}/>

      </div>

    </>
        
    );
}
