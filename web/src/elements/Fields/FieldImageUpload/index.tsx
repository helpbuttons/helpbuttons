import Loading from 'components/loading';
import Btn, { BtnType, IconType } from 'elements/Btn';
import { ImageContainer, ImageType } from 'elements/ImageWrapper';
import t from 'i18n';
import getConfig from 'next/config';
import { useEffect, useState } from 'react';
import { IoClose, IoCloudUpload } from 'react-icons/io5';
import ImageUploading from 'react-images-uploading';
import { alertService } from 'services/Alert';
import { createThumbnail } from 'shared/helpers/images.helper';
import { allowedImageExtensions, allowedImageTypes, fileFilter, parseSizeToBytes } from 'shared/types/files';

export default function FieldImageUpload({
  name,
  label,
  text,
  explain = null,
  subtitle = null,
  setValue,
  validationError,
  defaultImage = null,
  width = 100,
  height = 100,
  alt = "",
}) {
  const [image, setImage] = useState(defaultImage);
  const [isLoading, setIsLoading] = useState(false)

  const onChange = async (imageList, addUpdateIndex) => {
    setIsLoading(() => true)
    if(imageList.length > 0) {
      
      if(allowedImageTypes.indexOf(imageList[0].file.type) < 0){
        alertService.warn(t('validation.invalidMimeType', [allowedImageTypes.join(',')]))
        setIsLoading(() => false)
        return;
      }

      if(!fileFilter(imageList[0].file.name, allowedImageExtensions)){
        alertService.warn('file extension not allowed')
        alertService.warn(t('validation.supportFiles', [allowedImageExtensions.join(',')]))
        setIsLoading(() => false)

        return;
      }
      
      const _image = {
        file: imageList[0].file,
        thumbnail: await createThumbnail(imageList[0].file)
      }
      setImage(() => _image);
      setValue(name, _image);
    }
    else{
      setImage(() => null);
      setValue(name, null);
    }
    
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
          value={image ? [image] : []}
          onChange={onChange}
          maxNumber={1}
          dataURLKey="data_url"
        >
          {(
            { onImageUpload, onImageRemove, imageList }, // write your building UI
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
                  if(imageList.length > 0) {
                    onImageRemove(0)
                  }
                  onImageUpload();
                }}
              />
              
              {subtitle && (
                <div className="form__input-subtitle">
                  <div className="form__input-subtitle-side">
                    <label className="form__input-subtitle--text">
                      {subtitle}
                    </label>
                  </div>
                </div>
              )}
              {image && (
                  <div className="form__image-upload-preview--wrap">
                      <div className="form__image-upload-preview--file">
                          <div className="form__image-upload-preview--image">
                            <ImageContainer
                              src={image?.thumbnail || image}
                              imageType={ImageType.preview}
                              alt={alt}
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
                              onImageRemove(0);
                            }}
                          />
                      </div>
                  </div>
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


