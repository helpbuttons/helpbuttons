import { forwardRef } from "react";

const FieldRadioOption = forwardRef(({
  name,
  children,
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
        <div className="radio__content">{children}</div>
      </label>
    </>
  );
});

export default FieldRadioOption;
