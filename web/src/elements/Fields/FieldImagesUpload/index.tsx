import { ImageContainer } from 'elements/ImageWrapper';
import { useState } from 'react';
import ImageUploading from 'react-images-uploading';

export default function FieldImageUploads({
  name,
  label,
  maxNumber,
  setValue,
}) {
  const [images, setImages] = useState([]);

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
    if (imageList.length > 0) {
      const imageListData = imageList.map((item) => item.data_url)
      setValue(name, imageListData);
    }
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
          {(
            { imageList, onImageUpload, onImageRemove }, // write your building UI
          ) => (
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
              {imageList.length > 0 && (
                <ul>
                  {imageList.map((item, index) => (
                    <div key={item.id} className="image-item">
                      <ImageContainer
                        src={item.data_url}
                        // alt={alt}
                        // width={width}
                        // height={height}
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
                    </div>
                  ))}
                </ul>
              )}
            </div>
          )}
        </ImageUploading>
      </div>
    </>
  );
}
