//The smallest of buttons'cards. It ddisplays over the map when a marker is clicked / touched. Itt was very reduce info, like image, tags, title or other fieldds conidered by the buttonTemplate field.
// import { CardButtonHeadSmall } from "components/button/CardButton";
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { buttonColorStyle } from "shared/buttonTypes";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { CardButtonHeadSmall } from "components/button/CardButton";
import { ImageGallery } from "elements/ImageGallery";
import { alertService } from "services/Alert";
export default function CardButtonMap({ button, buttonTypes }) {
  // const {cssColor} = buttonTypes.find((buttonType) => buttonType.name == button.type)
  //   const buttonType = buttonTypes.find(
  //   (buttonTemplate) => buttonTemplate.name == button.type,
  // );
  //   if(!buttonType && buttonTypes.length > 0)
  //   {
  //     alertService.error(`type of button not found '${button.type}'`)
  //     console.error(`type of button not found '${button.type}'`)
  //   }
  return (
    <div >
      <div className="card-button-map">
        <CardButtonHeadSmall button={button} />
        <div className="card-button-map__picture-container">
          <div className="card-button-map__nav">
            <div className="arrow btn-circle__icon">
              <IoChevronBackOutline />
            </div>
            <div className="arrow btn-circle__icon">
              <IoChevronForwardOutline />
            </div>
          </div>
          <ImageGallery
            images={button?.images.map((image) => {
              return { src: image, alt: button.description };
            })}
          />
        </div>
      </div>
    </div>
  );
}
