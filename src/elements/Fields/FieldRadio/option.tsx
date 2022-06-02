export default function FieldRadioOption({
  handleChange,
  value,
  name,
  children,
}) {
  const onClick = (e) => {
    handleChange(name, value);
  };
  return (
    <>
      <label className="radio__label">
        <input
          onClick={onClick}
          type="radio"
          id={name}
          name={name}
          className="radio__radio"
        ></input>
        <div className="radio__content">{children}</div>
      </label>
    </>
  );
}
