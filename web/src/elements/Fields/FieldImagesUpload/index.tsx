import Loading from 'components/loading';
import Btn, { BtnType, IconType } from 'elements/Btn';
import { ImageContainer, ImageType } from 'elements/ImageWrapper';
import { useRef, useState } from 'react';
import { IoClose, IoCloudUpload } from 'react-icons/io5';
import ImageUploading from 'react-images-uploading';
import { createThumbnail } from 'shared/helpers/images.helper';

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
  const [isLoading, setIsLoading] = useState(false)

  const onChange = async (imageList, addUpdateIndex) => {
    if(imageList.length > images.length) {
      setIsLoading(() => true)
    }
    const imageListData = await Promise.all(imageList.map(async (item, idx) => {
      const thumb = await createThumbnail(item.file)
      return {
        file: item.file,
        thumbnail: thumb
      };
    }));
    setImages(() => imageListData);
    setValue(imageListData);
    setIsLoading(() => false)
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
              {images.length > 0 && (
                  <ul className="form__image-upload-preview--wrap">
                    {images.map((item, index) => (
                        <div key={index} className="form__image-upload-preview--file">
                          <div className="form__image-upload-preview--image">
                            <ImageContainer
                              src={item?.thumbnail || item}
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
                              onImageRemove(index)
                            }}
                          />
                        </div>
                    ))}
                  </ul>
              )}
              {isLoading && <Loading/>}
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
