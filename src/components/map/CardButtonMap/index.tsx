//The smallest of buttons'cards. It ddisplays over the map when a marker is clicked / touched. Itt was very reduce info, like image, tags, title or other fieldds conidered by the buttonTemplate field.
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { Link } from "elements/Link";
import { CardButtonHeadMedium } from "components/button/CardButton";
export default function CardButtonMap({ button }) {
  return (
    <div className={`card-button-map card-button-map--${button.type}`}>
      <CardButtonHeadMedium button={button}/>
    </div>
  );
}
