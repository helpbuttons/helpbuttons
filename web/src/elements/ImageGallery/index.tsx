import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { useState } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline, IoCloseCircleOutline } from "react-icons/io5";

export function ImageGallery({ images }) {
  
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const next = () => {
      setCurrentIndex((currentIndex + 1) % images.length);
    };
  
    const prev = () => {
      setCurrentIndex(
        (currentIndex - 1 + images.length) % images.length,
      );
    };
    
    // const [selectedImage, setSelectedImage] = useState(null)
    const [showSingleImage, setShowSingleImage] = useState(false)
    return (
      <>
        {showSingleImage && 
            <div className="card-button__gallery-zoom">
            <Btn
              btnType={BtnType.smallCircle}
              iconLink={<IoCloseCircleOutline />}
              iconLeft={IconType.circle}
              contentAlignment={ContentAlignment.center}
              onClick={() => setShowSingleImage(() => false)}
            />
            <ImageWrapper
              imageType={ImageType.buttonCard}
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
            />
            </div>
        }
        {(!showSingleImage && images )&& (
            <div className="card-button__picture">
            {images.length > 1 && (
              <div className="card-button__picture-nav">
                <Btn
                  btnType={BtnType.smallCircle}
                  iconLink={<IoChevronBackOutline />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.center}
                  onClick={() => prev()}
                />
                <Btn
                  btnType={BtnType.smallCircle}
                  iconLink={<IoChevronForwardOutline />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.center}
                  onClick={() => next()}
                />
              </div>
            )}
            {images.map((image, idx) => (
              <div
                onClick={() => {setShowSingleImage(() => true) }}
                key={idx}
                className={
                  images[currentIndex] === image ? 'show' : 'hide'
                }
              >
                <ImageWrapper
                  imageType={ImageType.buttonCard}
                  src={image.src}
                  alt={image.alt}
                />
              </div>
            ))}
          </div>
        )}
      </>
    );
  }