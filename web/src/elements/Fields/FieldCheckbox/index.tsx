import CheckBox from "elements/MultiSelectOption";
import React, { useEffect, useState } from "react";
import { IoCheckmark } from "react-icons/io5";
import FieldError from "../FieldError";
import t from "i18n";


export const FieldCheckbox = React.forwardRef(({
    label,
    name,
    explain,
    text,
    onChanged = (value) => {console.log(value)},
    defaultValue = false,
    textOn = null,
    validationError = false,
  }, ref) => {
    const [checked, setChecked] = useState(defaultValue)

    const onChange = () => {
      setChecked((prevValue) => {
        onChanged(!prevValue)
        return !prevValue
      })
      
    }
    return (
    <div className="form__field">
      {label && <label className="form__label">{label}</label>}
      {explain && <p className="form__explain">{explain}</p>}

    <div className="checkbox">
        <label className="checkbox__label">
          <input
            type="checkbox"
            className="checkbox__checkbox"
            name={name}
            checked={checked}
            ref={ref} 
            onChange={onChange}
          ></input>
          <div
            className={`checkbox__content ${checked ? 'checked' : ''}`}
          >
              <div className="btn-filter__icon">{checked && <IoCheckmark/>}</div>
                <div className="btn-with-icon__text">
                    {(textOn && checked) ? textOn : text}
                </div>
           </div>
        </label>
        <FieldError validationError={validationError} />
      </div> 
      </div>
      )
  })