import CheckBox from "elements/Checkbox";
import React from "react";


export const FieldCheckbox = React.forwardRef(({
    label,
    name,
    onChange,
    onBlur,
    validationError,
    checked,
    explain,
    text,
  }, ref) => {
    return (
    <div className="form__field">
    <p className="form__label">{label}</p>
    <p className="form__explain">{explain}</p>
  
    <CheckBox defaultValue={false} name={name} icon="check" ref={ref} children={undefined} handleChange={name, checked}>
        <div className="btn-with-icon__text">
          {text}
        </div>
    </CheckBox>

    <div className="checkbox">
        <label className="checkbox__label">
          <input
            type="checkbox"
            className="checkbox__checkbox"
            name={name}
            // checked={checked}
            ref={ref} 
            onChange={onChange}
          ></input>
          <div
            className={`checkbox__content ${checked ? 'checked' : ''}`}
          >
              <div className="btn-filter__icon">{checked && <IoCheckmark/>}</div>
                <div className="btn-with-icon__text">
                    {text}
                </div>
           </div>
        </label>
      </div> 
      </div>
      )
  })