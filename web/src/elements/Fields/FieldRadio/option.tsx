import { forwardRef } from "react";

const FieldRadioOption = forwardRef(({
  name,
  children,
  color,
  value,
  onChange,
  onBlur
}, ref) => {
  return (
    <>
    <label className="radio__label">
        <input
          ref={ref}
          type="radio"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="radio__radio"
        ></input>
        <div className="radio__content"
          style={{'borderColor': color} as React.CSSProperties} 
        >
          {children}
        </div>
      </label>
    </>
  );
});

export default FieldRadioOption;
