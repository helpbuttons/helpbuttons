import React from "react";
import FieldError from "../FieldError";

export default function FieldRadio({ children, label, validationError }) {
  return (
    <>
      <div className="form__field">
        <p className="popup__paragraph">{label}</p>
        <div className="radio">{children}</div>

        <FieldError validationError={validationError} />
      </div>
    </>
  );
}
