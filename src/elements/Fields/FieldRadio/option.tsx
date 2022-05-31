export default function FieldRadioOption({
  handleChange,
  value,
  name,
  children,
}) {
  const onClick = (e) => {
    e.preventDefault();
    handleChange(name, value);
  };
  return (
    <>
      <input
        onClick={onClick}
        type="radio"
        className={`btn-with-icon btn-with-icon--hover btn-with-icon--${
          value ? value : ""
        }`}
      />
      {children}
    </>
  );
}
