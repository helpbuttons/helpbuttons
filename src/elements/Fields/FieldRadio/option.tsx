export default function FieldRadioOption({
  handleChange,
  value,
  name,
  children,
  isChecked,
}) {
  const onClick = (e) => {
    handleChange(name, value);
  };
  return (
    <>
      <label className="radio__label">
        <input
          onChange={onClick}
          type="radio"
          id={name}
          name={name}
          className="radio__radio"
          checked={isChecked}
        ></input>
        <div className="radio__content">{children}</div>
      </label>
    </>
  );
}
