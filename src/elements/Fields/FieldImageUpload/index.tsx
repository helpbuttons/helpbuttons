import { useState } from "react";
import ImageUploading from "react-images-uploading";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

export default function FieldUploadImage({ name, label, handleChange }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const maxNumber = 4;

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
    // if (imageList.length > 0) {
      // setSelectedImage(imageList[0].file);
    // }
    // handleChange("images", imageList);

    const imageFilesList = imageList.map((imageData) => imageData.file);
    // setImages(imageFilesList);
    handleChange("images", imageFilesList);
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
