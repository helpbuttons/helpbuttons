import { ImageContainer } from 'elements/ImageWrapper';
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import ImageUploading from 'react-images-uploading';

import FieldError from '../FieldError';

export default function FieldUploadImage({ name, label, width = 100, height = 100, alt = "", validationError, setValue}) {
  const [images, setImages] = useState([]);

  const onChange = (imageList, addUpdateIndex) => {
    // const image = imageList[0];
    // // console.log('img :: ')
    // // console.log(image)
    // // console.log('img list')
    console.log(imageList)
    // replace(image);
    setImages(imageList);
    setValue(name, imageList[0].data_url)
  };

  return (
    <>
      <div className="form__field">
        <ImageUploading
          value={images}
          onChange={onChange}
          maxNumber={1}
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
                  <ImageContainer
                    src={imageList[0].data_url}
                    alt={alt}
                    width={width}
                    height={height}
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
        {validationError && 
         <FieldError validationError={validationError} />
        }
      </div>
    </>
  );
}
