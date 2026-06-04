import React from "react";
import FieldError from "../FieldError";

export default function FieldRadio({ children, label, explain,row = false, validationError = null }) {
  return (
    <>
      <div className={row ? "form__field--noMargin" : "form__field" }>
        <label className="form__label">{label}</label>
        <p className="form__explain">{explain}</p>
        <div className={ row ? "radio radio--row" : "radio "}>{children}</div>

        <FieldError validationError={validationError} />
      </div>
    </>
  );
}
