import CheckBox from "elements/MultiSelectOption";
import React, { useEffect, useState } from "react";
import { IoCheckmark } from "react-icons/io5";


export const FieldCheckCard = React.forwardRef(({
    label,
    name,
    explain,
    text,
    image,
    onChanged = () => {},
    defaultValue = false,
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
    <label className="form__label">{label}</label>

    <div className="checkbox-card">
        <label className="checkbox-card__label">
          <input
            type="checkbox"
            className="checkbox-card__checkbox"
            name={name}
            checked={checked}
            ref={ref} 
            onChange={onChange}
          ></input>
          <div
            className={`checkbox-card__content ${checked ? 'checked' : 'checked'}`}
          >
              <div className="checkbox-card__image">{image}</div>
                <div className="btn-with-icon__text">
                    {text}
                    <p className="form__explain">{explain}</p>
                </div>
           </div>
        </label>
      </div> 
      </div>
      )
  })