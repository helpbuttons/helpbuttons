import { useState } from "react";
import ImageUploading from "react-images-uploading";

export default function FieldUploadImages({ name, label, handleChange, maxNumber }) {
  const [images, setImages] = useState([]);
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
    const imageFilesList = imageList.map((imageData) => imageData.file);
    handleChange(name, imageFilesList);
  };

  return (
    <>
      <div className="form__field">
        <ImageUploading
          multiple
          value={images}
          onChange={onChange}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({
            imageList,
            onImageUpload,
            onImageRemove,
          }) => (
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
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image.data_url} alt="" width="100" />
                  <div className="image-item__btn-wrapper">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onImageRemove(index);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
      </div>
    </>
  );
}
