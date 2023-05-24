import React from "react";
import FieldError from "../FieldError";

export default function FieldRadio({ children, label, explain, validationError }) {
  return (
    <>
      <div className="form__field">
        <p className="form__label">{label}</p>
        <p className="form__explain">{explain}</p>
        <div className="radio">{children}</div>

        <FieldError validationError={validationError} />
      </div>
    </>
  );
}
