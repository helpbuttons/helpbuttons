//Card that displays a resume of the button info in tthe List component. Its fieldds can be customizedd according to buttonTemplate.
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { Link } from "elements/Link";
import { CardButtonHeadMedium } from "components/button/CardButton";


export default function CardButtonList({button}) {
  let imageUrl = "";
  if (button && button.images && button.images.length > 0) {
    // TODO, make imageWrapper support multiple images...
    imageUrl = button.images[0];
  }

  return (
    <div className="list__element">
      <div className={`card-button-list card-button-list--${button.type}`}>
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
            src={imageUrl}
            alt={button.description}
          />
        </div>
        <div className="card-button-list__content">
          <Link href={`/ButtonFile/${button.id}`}>
            <CardButtonHeadMedium button={button}/>
          </Link>
        </div>
      </div>
    </div>
  );
}
