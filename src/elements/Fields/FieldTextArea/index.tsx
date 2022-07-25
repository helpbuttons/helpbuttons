import React from "react";
import FieldError from "../FieldError";


interface IFieldTextArea {
  label: string,
  onChange: Function,
  name: string,
  validationError: any,
  placeholder: string,
  classNameExtra?: string
}


export const FieldTextArea = React.forwardRef(({
    label,
    onChange,
    name,
    validationError,
    placeholder,
    classNameExtra,
}, ref): IFieldTextArea => {
    return (
      <>
      <div className="form__field">
        <p className="popup__paragraph">{label}</p>
        <textarea
          onChange={onChange}
          name={name}
          className={`${classNameExtra} textarea__textarea`}
          placeholder={placeholder}
          ref={ref}
        ></textarea>
        <FieldError validationError={validationError} />
      </div>
    </>
    );
});
