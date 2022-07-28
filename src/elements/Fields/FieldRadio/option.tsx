import { forwardRef } from "react";

export const FieldRadioOption = forwardRef(({
  name,
  children,
  value,
  onChange
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
          className="radio__radio"
        ></input>
        <div className="radio__content">{children}</div>
      </label>
    </>
  );
});