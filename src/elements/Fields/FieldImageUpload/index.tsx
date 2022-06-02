export default function FieldUploadImage({ label }) {
  return (
    <>
      <div className="form__field">
        <label htmlFor="files" className="btn">
          {label}
        </label>
      </div>
    </>
  );
}
