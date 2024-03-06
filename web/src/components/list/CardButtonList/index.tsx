//Card that displays a resume of the button info in tthe List component. Its fieldds can be customizedd according to buttonTemplate.
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoChevronBackOutline } from 'react-icons/io5';
import { CardButtonHeadMedium } from 'components/button/CardButton';
import { buttonColorStyle } from 'shared/buttonTypes';
import { HiglightHexagonFromButton, updateCurrentButton } from 'state/Explore';
import { store } from 'pages';
import router from 'next/router';

export default function CardButtonList({ buttonTypes, button, showMap, linkToPopup }) {
  const buttonType = buttonTypes.find(
    (buttonTemplate) => buttonTemplate.name == button.type,
  );
  if(!buttonType)
  {
    console.error(`type of button not found '${button.type}'`)
  }
  return (
    <>
      {buttonType && (
        <div className="list__element" 
          onMouseEnter={() => {store.emit(new HiglightHexagonFromButton(button.hexagon))}}
          // onMouseLeave={() => {store.emit(new HiglightHexagonFromButton(null))}}
          onClick={() => {
            if(linkToPopup)
            {
              store.emit(new HiglightHexagonFromButton(button.hexagon))
              store.emit(new updateCurrentButton(button))
            }else{
              router.push(`/ButtonFile/${button.id}`)
            }
          }}
          >
          <div style={buttonColorStyle(buttonType.cssColor)}>
              <div className={showMap ? "card-button-list" : "card-button-list--vertical"}>
                {button.image && (
                  <div className="card-button-list__picture-container">
                    <div className="card-button-list__nav">
                      <div className="arrow btn-circle__icon">
                        <IoChevronBackOutline />
                      </div>
                      <div className="arrow btn-circle__icon">
                        <IoChevronForwardOutline />
                      </div>
                    </div>

                    <ImageWrapper
                      imageType={ImageType.cardList}
                      src={button.image}
                      alt={button.description}
                    />
                  </div>
                )}
                <div className="card-button-list__content">
                  <CardButtonHeadMedium
                    button={button}
                    buttonType={buttonType}
                  />
                </div>
              </div>
          </div>
        </div>
      )}
    </>
  );
}
