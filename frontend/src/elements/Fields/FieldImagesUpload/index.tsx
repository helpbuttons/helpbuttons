import { Controller, useFieldArray } from "react-hook-form";
import ImageUploading from "react-images-uploading";

export default function FieldUploadImages({ name, label, maxNumber, control }) {
  const { fields, replace, remove } = useFieldArray({
    control,
    name: name,
  });

  const onChange = (imageList, addUpdateIndex) => {
    replace(imageList);
  };

  return (
    <>
      <div className="form__field">
        <ImageUploading
          multiple
          value={fields}
          onChange={onChange}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({ onImageUpload }) => (
            // write your building UI
            <div className="upload__image-wrapper">
              <label
                htmlFor="files"
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  onImageUpload();
                }}
              >
                {label}
              </label>
              <ul>
                {fields.map((item, index) => (
                  <div key={item.id} className="image-item">
                    <Controller
                      render={({ field: { value } }) => (
                        <img src={value.data_url} alt="" width="100" />
                      )}
                      name={`${name}.${index}`}
                      control={control}
                    />
                    <button type="button" onClick={() => remove(index)}>
                      x
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          )}
        </ImageUploading>
      </div>
    </>
  );
}
