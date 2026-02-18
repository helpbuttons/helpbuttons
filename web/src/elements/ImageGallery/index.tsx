import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { useState, useRef } from "react";
import { IoChevronBackOutline, IoChevronForwardOutline, IoClose, IoCloseCircleOutline } from "react-icons/io5";

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

    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const minSwipeDistance = 50;

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return;
      
      touchEndX.current = e.touches[0].clientX;
      const offset = touchEndX.current - touchStartX.current;
      setDragOffset(offset);
    };

    const handleTouchEnd = () => {
      const distance = touchStartX.current - touchEndX.current;
      const isSwipe = Math.abs(distance) > minSwipeDistance;
      
      if (isSwipe) {
        // Calculate the final position based on swipe direction
        const screenWidth = window.innerWidth;
        
        if (distance > 0) {
          // Swiped left - animate to -100% (next image)
          setDragOffset(-screenWidth);
          setTimeout(() => {
            setIsDragging(true); // Disable transition temporarily
            next();
            setDragOffset(0);
            setTimeout(() => {
              setIsDragging(false); // Re-enable transition
            }, 10);
          }, 300); // Match transition duration
        } else {
          // Swiped right - animate to +100% (previous image)
          setDragOffset(screenWidth);
          setTimeout(() => {
            setIsDragging(true); // Disable transition temporarily
            prev();
            setDragOffset(0);
            setTimeout(() => {
              setIsDragging(false); // Re-enable transition
            }, 10);
          }, 300); // Match transition duration
        }
      } else {
        // No swipe - snap back to center
        setDragOffset(0);
      }
      
      setIsDragging(false);
      touchStartX.current = 0;
      touchEndX.current = 0;
    };

    return (
      <div className="card-button__image-gallery">
      {showSingleImage && 
          <div className="card-button__gallery-zoom"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            <Btn
              btnType={BtnType.circle}
              iconLink={<IoClose />}
              iconLeft={IconType.circle}
              extraClass="card-button__gallery-zoom--close-btn"
              contentAlignment={ContentAlignment.center}
              onClick={() => setShowSingleImage(() => false)}
            />
            
            {images.length > 1 && (
              <div className="card-button__picture-nav">
                <Btn
                  btnType={BtnType.smallCircle}
                  iconLink={<IoChevronBackOutline />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.center}
                  onClick={() => prev()}
                  extraClass="arrow"
                />
                <Btn
                  btnType={BtnType.smallCircle}
                  iconLink={<IoChevronForwardOutline />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.center}
                  onClick={() => next()}
                  extraClass="arrow"
                />
              </div>
            )}

            <div className="card-button__image-wrapper">
              {/* Previous image */}
              <div
                key={`prev-${(currentIndex - 1 + images.length) % images.length}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  transform: `translateX(${dragOffset}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
              >
                <ImageWrapper
                  imageType={ImageType.buttonCardZoom}
                  src={images[(currentIndex - 1 + images.length) % images.length].src}
                  alt={images[(currentIndex - 1 + images.length) % images.length].alt}
                />
              </div>

              {/* Current image */}
              <div
                key={`current-${currentIndex}`}
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `translateX(${dragOffset}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
              >
                <ImageWrapper
                  imageType={ImageType.buttonCardZoom}
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                />
              </div>

              {/* Next image */}
              <div
                key={`next-${(currentIndex + 1) % images.length}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '100%',
                  width: '100%',
                  height: '100%',
                  transform: `translateX(${dragOffset}px)`,
                  transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                }}
              >
                <ImageWrapper
                  imageType={ImageType.buttonCardZoom}
                  src={images[(currentIndex + 1) % images.length].src}
                  alt={images[(currentIndex + 1) % images.length].alt}
                />
              </div>
            </div>
          </div>
        }
        {(!showSingleImage && images )&& (
            <div className="card-button__picture"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
            {images.length > 1 && (
              <div className="card-button__picture-nav">
                <Btn
                  btnType={BtnType.smallCircle}
                  iconLink={<IoChevronBackOutline />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.center}
                  onClick={() => prev()}
                  extraClass="arrow"
                />
                <Btn
                  btnType={BtnType.smallCircle}
                  iconLink={<IoChevronForwardOutline />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.center}
                  onClick={() => next()}
                  extraClass="arrow"
                />
              </div>
            )}
            <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
            {images.map((image, idx) => {
              const offset = idx - currentIndex;
              const position = offset * 100; // -100%, 0%, 100%
              
              return (
                <div
                  onClick={() => {setShowSingleImage(() => true) }}
                  key={idx}
                  className={
                    Math.abs(offset) <= 1 ? 'show' : 'hide' // Show current, prev, and next
                  }
                  style={{
                    position: offset === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: offset === 0 ? 0 : `${position}%`,
                    width: '100%',
                    transform: `translateX(${dragOffset}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                  }}
                >
                  <ImageWrapper
                    imageType={ImageType.buttonCard}
                    src={image.src}
                    alt={image.alt}
                  />
                </div>
              );
            })}
          </div>
          </div>
        )}
      </div>
    );
  }