import React, { ForwardedRef, ReactNode, useState } from "react";
import FieldError from "../FieldError";
import t from "i18n";

interface IFieldText {
    label: string;
    handleChange?: Function;
    name: string;
    validationError?: any;
    classNameInput?: string;
    placeholder?: string;
    multiInput?: boolean;
    children?: ReactNode;
    explain?: string;
    extraMessage?: string;
    maxLength?: number;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FieldText = React.forwardRef<HTMLInputElement, IFieldText>(
    (
      {
        label,
        name,
        classNameInput,
        placeholder,
        onChange,
        onBlur,
        validationError,
        multiInput = false,
        explain,
        extraMessage,
        maxLength = -1,
        defaultValue,
        children,
      },
      ref: ForwardedRef<HTMLInputElement>
    ) => {
      const [textLength, setTextLength] = useState(0);
  
      const onInput = (obj: React.ChangeEvent<HTMLInputElement>) => {
        if (maxLength > 0) {
          if (obj.target.value.length > maxLength) {
            obj.target.value = obj.target.value.slice(0, maxLength);
          }
          setTextLength(obj.target.value.length);
        }
      };
  
      return (
        <div
          className={
            "form__field " + (multiInput ? "form__field--noMargin" : "")
          }
        >
          {label && <label className="form__label">{label}</label>}
          {explain && <p className="form__explain">{explain}</p>}
          <input
            name={name}
            ref={ref}
            type="text"
            placeholder={placeholder ? placeholder : label}
            onChange={onChange}
            onBlur={onBlur}
            className={`form__input ${classNameInput} ${
              validationError ? "validation-error" : ""
            }`}
            defaultValue={defaultValue}
            onInput={onInput}
          />
          <div className="form__input-subtitle">
            <div className="form__input-subtitle-side">
              {maxLength > 0 && (
                <label className="form__input-subtitle--text">
                  {textLength} / {maxLength}
                </label>
              )}
              <label className="form__input-subtitle--error">
                <FieldError
                  validationError={validationError}
                  extraMessage={extraMessage}
                />
              </label>
            </div>
  
            {/* {subInputLink &&
  
                      <div className="form__input-subtitle-side">
                          <a href={subInputLink} className="form__input-subtitle--text link">
                              {subInputLinkText}
                          </a>
                      </div>
                  } */}
          </div>
          {children}
        </div>
      );
    }
  );
  
  FieldText.displayName = "FieldText";
  
  export default FieldText;