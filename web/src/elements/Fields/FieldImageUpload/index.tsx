import { ImageContainer } from 'elements/ImageWrapper';
import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import ImageUploading from 'react-images-uploading';

import FieldError from '../FieldError';

export default function FieldImageUpload({ name, label, width = 100, height = 100, alt = "", validationError, control, setValue}) {

  const [image, setImage] = useState(null)
  const onChange = (imageList, addUpdateIndex) => {
    setImage(imageList[0].data_url)
    if(imageList.length > 0) {
      setValue(name, imageList[0].data_url)
    }
  };

  const value = useWatch({control, name: name});

  useEffect(() => {
    if (value) {
      setImage(value);
    }
  }, [value])
  return (
    <>
      <div className="form__field">
        <ImageUploading
          value={image}
          onChange={onChange}
          maxNumber={1}
          dataURLKey="data_url"
        >
          {({ onImageUpload, onImageRemove }) => (
            // write your building UI
            <div className="upload__image-wrapper">
              <label
                htmlFor="files"
                className="btn"
                onClick={(e) => {
                  setImage(null);
                  e.preventDefault();
                  onImageUpload();
                }}
              >
                {label}
              </label>
              {image && (
                <>
                  <ImageContainer
                    src={image}
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
