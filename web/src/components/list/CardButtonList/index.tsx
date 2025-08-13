//Card that displays a resume of the button info in tthe List component. Its fieldds can be customizedd according to buttonTemplate.
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoChevronBackOutline } from 'react-icons/io5';
import { CardButtonHeadMedium } from 'components/button/CardButton';
import { buttonColorStyle } from 'shared/buttonTypes';
import { HiglightHexagonFromButton, updateCurrentButton } from 'state/Explore';
import { store } from 'state';
import router from 'next/router';
import { MainPopupPage, SetMainPopup, SetMainPopupCurrentButton } from 'state/HomeInfo';
import { alertService } from 'services/Alert';

export enum ButtonLinkType {
  EXPLORE,
  IFRAME,
  MAINPOPUP,
}
export default function CardButtonList({ buttonTypes, button, showMap, linkType = null }) {
  const buttonType = buttonTypes.find(
    (buttonTemplate) => buttonTemplate.name == button.type,
  );
  if(!buttonType && buttonTypes.length > 0)
  {
    alertService.error(`type of button not found '${button.type}'`)
    console.error(`type of button not found '${button.type}'`)
  }
  return (
    <>
      {buttonType && (
        <div className="list__element">
          <CardButtonLink button={button} linkType={linkType}>
          <div style={buttonColorStyle(buttonType.cssColor)}>
              <div className={showMap ? "card-button-list" : "card-button-list"}>
                {button.image && (
                  <div className={showMap ? "card-button-list__picture-container" : "card-button-list__picture-container"}>
                    <div className="card-button-list__nav">
                      <div className="arrow btn-circle__icon">
                        <IoChevronBackOutline />
                      </div>
                      <div className="arrow btn-circle__icon">
                        <IoChevronForwardOutline />
                      </div>
                    </div>
                    {showMap ?
                      <ImageWrapper
                        imageType={ImageType.cardList}
                        src={button.image}
                        alt={button.description}
                      />
                    :
                      <ImageWrapper
                        imageType={ImageType.cardListVertical}
                        src={button.image}
                        alt={button.description}
                      />
                    }
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
          </CardButtonLink>
        </div>
      )}
    </>
  );
}

export function CardButtonLink({ button, linkType , children }) {
    
  if(linkType == ButtonLinkType.EXPLORE)
    {
      return <a href={`/ButtonFile/${button.id}`} onMouseEnter={() => {store.emit(new HiglightHexagonFromButton(button.hexagon))}}
      onMouseLeave={() => {store.emit(new HiglightHexagonFromButton(null))}} onClick={(e) => {e.preventDefault();store.emit(new HiglightHexagonFromButton(button.hexagon))
        store.emit(new updateCurrentButton(button))}}>{children}</a>
    }else if(linkType == ButtonLinkType.IFRAME){
      return <a href={`/ButtonFile/${button.id}`} target="_blank">{children}</a>
    }else if(linkType == ButtonLinkType.MAINPOPUP){
      return <a href={`/ButtonFile/${button.id}`} onClick={(e) => {
        e.preventDefault()
        store.emit(new SetMainPopupCurrentButton(button))
      } }>{children}</a>
    }else{
      return <a href={`/ButtonFile/${button.id}`} target="_blank">{children}</a>
    }
}