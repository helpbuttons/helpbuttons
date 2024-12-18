import React, { useState } from "react";
import FieldError from "../FieldError";
import { EmojiPicker } from "components/emoji";
import { ShowDesktopOnly } from "elements/SizeOnly";


export const FieldTextArea = React.forwardRef((props, ref) => {

  const {
    label,
    name,
    validationError,
    placeholder,
    classNameExtra,
    watch,
    setValue,
    setFocus,
    explain,
    maxLength = -1
  } = props;
  
  const addEmoji = (emoji) => {
    const value = watch(name)
    setValue(name, `${value}${emoji}`)
    setFocus(name, { shouldSelect: false })
  }
  const handleChange = (event) => {
    setValue(name, `${event.target.value}`)
  }
    const [textLength, setTextLength] = useState(0);
     const onInput = (obj) => {
        if (maxLength > 0){
            if ( obj.target.value.length > maxLength) {
                obj.target.value = obj.target.value.slice(0, maxLength)
            }
            setTextLength(obj.target.value.length)
        } 
    }
    return (
      <>
      <div className="form__field">
        <label className="form__label">{label}</label>
        <p className="form__explain">{explain}</p>

        <textarea
          onChange={(event) => {handleChange(event)}}
          name={name}
          className={`${classNameExtra} textarea__textarea`}
          placeholder={placeholder}
          ref={ref}
          onInput={onInput}
        ></textarea>
        {maxLength > 0 && 
          <>
          <div className="form__input--text-length">{textLength} / {maxLength}</div>
          </>
        }

        <FieldError validationError={validationError} />
      </div>
    </>
    );
});


