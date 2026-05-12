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
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onInputKeyDown?:(e: React.KeyboardEventHandler<HTMLInputElement>) => void;
    autoFocus?: boolean;
    multiLine?: boolean;

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
        onFocus = () => {},
        validationError,
        multiInput = false,
        multiLine=false,
        explain,
        extraMessage,
        maxLength = -1,
        defaultValue,
        children,
        onInputKeyDown,
        autoFocus = false
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

      const onTextareaInput = (obj: React.FormEvent<HTMLTextAreaElement>) => {
        const el = obj.currentTarget;
        el.style.height = 'auto';
        el.style.height = (el.scrollHeight - 16) + 'px';
        onInput(obj as any);
      };
   
      return (
        <div
          className={
            "form__field " + (multiInput ? "form__field--noMargin" : "") 
          }
        >
          {label && <label className="form__label">{label}</label>}
          {explain && <p className="form__explain">{explain}</p> }
          {multiLine ?
              <textarea
                name={name}
                ref={ref as unknown as ForwardedRef<HTMLTextAreaElement>}
                placeholder={placeholder ? placeholder : label}
                onChange={onChange as any}
                onBlur={onBlur as any}
                className={`form__input form__input--maskTextarea ${classNameInput} ${
                  validationError ? "validation-error" : ""
                }`}
                defaultValue={defaultValue}
                onInput={onTextareaInput}
                onFocus={onFocus as any}
                onKeyDown={onInputKeyDown as any}
                autoFocus={autoFocus}
              />
            :
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
              onFocus={onFocus}
              onKeyDown={onInputKeyDown}
              autoFocus={autoFocus}
            />
          }
          
          <div className="form__input-subtitle">
              {maxLength > 0 && (
                <label className="form__input-subtitle--text">
                  {textLength} / {maxLength}
                </label>
              )}
              
                <FieldError
                  validationError={validationError}
                  extraMessage={extraMessage}
                />

          </div>
          {children}
          </div>
      );
    }
  );
  
  FieldText.displayName = "FieldText";
  
  export default FieldText;