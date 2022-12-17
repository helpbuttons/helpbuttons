import { useFieldArray } from 'react-hook-form';
import ImageUploading from 'react-images-uploading';

export default function FieldUploadImage({ name, label, control }) {
  const { fields, replace } = useFieldArray({
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
          value={fields}
          onChange={onChange}
          dataURLKey="data_url"
        >
          {({ imageList, onImageUpload, onImageRemove }) => (
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
              {imageList[0] && (
                <>
                  <img
                    src={imageList[0].data_url}
                    alt=""
                    width="100"
                  />
                  <div className="image-item__btn-wrapper">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onImageRemove(0);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </ImageUploading>
      </div>
    </>
  );
}
