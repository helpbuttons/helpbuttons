//Card that displays a resume of the button info in tthe List component. Its fieldds can be customizedd according to buttonTemplate.
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoChevronBackOutline } from 'react-icons/io5';
import { CardButtonHeadMedium } from 'components/button/CardButton';
import { buttonColorStyle } from 'shared/buttonTypes';
import { updateCurrentButton } from 'state/Explore';
import { store } from 'pages';

export default function CardButtonList({ buttonTypes, button }) {
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
          onClick={() => {
          store.emit(new updateCurrentButton(button))
          }}
          >
          <div style={buttonColorStyle(buttonType.cssColor)}>
              <div className="card-button-list">
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
