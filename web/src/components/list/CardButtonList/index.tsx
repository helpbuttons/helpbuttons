//Card that displays a resume of the button info in tthe List component. Its fieldds can be customizedd according to buttonTemplate.
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoChevronBackOutline } from 'react-icons/io5';
import { CardButtonHeadMedium } from 'components/button/CardButton';
import { buttonColorStyle } from 'shared/buttonTypes';
import { HiglightHexagonFromButton, updateCurrentButton } from 'state/Explore';
import { store } from 'state';
import { SetMainPopupCurrentButton } from 'state/HomeInfo';
import { alertService } from 'services/Alert';
import t from 'i18n';

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
          <CardButtonEntryState expired={button.expired}
            awaitingApproval={button.awaitingApproval}/>
            
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

function CardButtonEntryState({expired, awaitingApproval})
{
  if(expired)
  {
    return (<div className="list__element_button--expired">{t('button.expiredLabel')}</div>)
  }
  if(awaitingApproval)
  {
    return (<div className="list__element_button--awaiting-approval">{t('button.awaitingApprovalLabel')}</div>)
  }
}
export function CardButtonLink({ button, linkType, children }) {
  // Touch device detection
  const isTouchDevice = () => {
    return (
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        navigator.maxTouchPoints > 0 )
    );
  };

  const touch = isTouchDevice();

  if (linkType == ButtonLinkType.EXPLORE) {
    return (
      <a
        href={`/Show/${button.id}`}
        onMouseEnter={!touch ? () => store.emit(new HiglightHexagonFromButton(button.hexagon)) : undefined}
        onMouseLeave={!touch ? () => store.emit(new HiglightHexagonFromButton(null)) : undefined}
        onClick={(e) => {
          e.preventDefault();
          store.emit(new HiglightHexagonFromButton(button.hexagon));
          store.emit(new updateCurrentButton(button));
        }}
        style={{ display: 'block', cursor: 'pointer' }}
      >
        {children}
      </a>
    );
  } else if (linkType == ButtonLinkType.IFRAME) {
    return <a href={`/ButtonFile/${button.id}`} target="_blank" style={{ display: 'block', cursor: 'pointer' }}>{children}</a>;
  } else if (linkType == ButtonLinkType.MAINPOPUP) {
    return (
      <a
        href={`/ButtonFile/${button.id}`}
        onClick={(e) => {
          e.preventDefault();
          store.emit(new SetMainPopupCurrentButton(button));
        }}
        style={{ display: 'block', cursor: 'pointer' }}
      >
        {children}
      </a>
    );
  } else {
    return <a href={`/ButtonFile/${button.id}`} target="_blank" style={{ display: 'block', cursor: 'pointer' }}>{children}</a>;
  }
}