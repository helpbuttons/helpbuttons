//The smallest of buttons'cards. It ddisplays over the map when a marker is clicked / touched. Itt was very reduce info, like image, tags, title or other fieldds conidered by the buttonTemplate field.
import { CardButtonHeadMedium } from "components/button/CardButton";
import CardButtonList from "components/list/CardButtonList";
export default function CardButtonMap({ button }) {
  return (
    <div className={`card-button-map card-button-map--${button.type}`}>
      <CardButtonList button={button}/>
    </div>
  );
}
