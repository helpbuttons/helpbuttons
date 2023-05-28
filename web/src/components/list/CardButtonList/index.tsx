//Card that displays a resume of the button info in tthe List component. Its fieldds can be customizedd according to buttonTemplate.
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { Link } from "elements/Link";
import { CardButtonHeadMedium } from "components/button/CardButton";
import { GlobalState, store } from "pages";
import { useRef } from "store/Store";
import { Button } from "shared/entities/button.entity";
import { buttonColorStyle, buttonTypes } from "shared/buttonTypes";



export default function CardButtonList({button}) {

  const { cssColor } = buttonTypes.find((buttonType) => {
    return buttonType.name === button.type;
  });

  return (
    <>
    <div className="list__element">
    <div style={buttonColorStyle(cssColor)}>
      <div className="card-button-list">
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
        <a className="card-button-list__content" href={`/ButtonFile/${button.id}`}>
            <CardButtonHeadMedium button={button}/>
        </a>
      </div>
    </div>
    </div>
    </>
  );
}
