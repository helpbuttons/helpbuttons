import Btn, { BtnType, IconType } from 'elements/Btn';
import { ImageContainer, ImageType } from 'elements/ImageWrapper';
import { useEffect, useState } from 'react';
import { IoClose, IoCloudUpload } from 'react-icons/io5';
import ImageUploading from 'react-images-uploading';

export default function FieldImageUploads({
  name,
  label,
  text,
  explain,
  maxNumber,
  setValue,
  validationError,
  defaultImages = [],
  width = 100,
  height = 100,
}) {
  const [images, setImages] = useState(defaultImages);

  const onChange = (imageList, addUpdateIndex) => {
    if (imageList.length > 0) {
      setImages(() => imageList);
      updateValues(imageList);
    }
  };

  const updateValues = (imagesList) => {
    const imageListData = imagesList.map((item) => {
      if (item.data_url) {
        return item.data_url;
      }
      return item;
    });
    setValue(imageListData);
  };
  const onRemoveImage = (index) => {
    let z = JSON.parse(JSON.stringify(images));
    z.splice(index, 1);
    setImages(() => z);
    updateValues(z);
  };

  return (
    <>
      <div className="form__field">
      {label && <label className="form__label">{label}</label>}
      {explain && 
          <p className="form__explain">{explain}</p>
      }
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
            <div className="form__image-upload__image-wrapper">
              {/* <label
                htmlFor="files"
                className="btn upload_file"
                onClick={(e) => {
                  e.preventDefault();
                  onImageUpload();
                }}
              >
                {text}
              </label> */}

              <Btn
                  btnType={BtnType.fileUpload}
                  iconLink={<IoCloudUpload />}
                  iconLeft={IconType.svg}
                  htmlFor="files"
                  caption={text}
                  onClick={(e) => {
                    e.preventDefault();
                    onImageUpload();
                  }}
                />

              {imageList.length > 0 && (
                  <ul className="form__image-upload-preview--wrap">
                    {imageList.map((item, index) => (
                        <div key={index} className="form__image-upload-preview--file">
                          <div className="form__image-upload-preview--image">
                            <ImageContainer
                              src={item.data_url ? item.data_url : item}
                              imageType={ImageType.preview}
                              alt="..."
                              width={width}
                              height={height}
                            />
                          </div>

                          <Btn
                            btnType={BtnType.circle}
                            iconLink={<IoClose />}
                            iconLeft={IconType.svg}
                            extraClass={
                              'form__image-upload--remove-icon'
                            }
                            onClick={(e) => {
                              e.preventDefault();
                              onRemoveImage(index);
                            }}
                          />
                        </div>
                    ))}
                  </ul>
              )}
            </div>
          )}
        </ImageUploading>
      </div>
      {validationError && (
        <span style={{ color: 'red' }}>{validationError}</span>
      )}
    </>
  );
}
