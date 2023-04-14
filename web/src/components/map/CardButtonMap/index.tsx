//The smallest of buttons'cards. It ddisplays over the map when a marker is clicked / touched. Itt was very reduce info, like image, tags, title or other fieldds conidered by the buttonTemplate field.
import { CardButtonHeadMedium } from "components/button/CardButton";
import CardButtonList from "components/list/CardButtonList";
import { buttonColorStyle, buttonTypes } from "shared/buttonTypes";
export default function CardButtonMap({ button }) {
  const {cssColor} = buttonTypes.find((buttonType) => buttonType.name == button.type)
  return (
    <div style={buttonColorStyle(cssColor)}>
    <div className="card-button-map">
      <CardButtonList button={button}/>
    </div>
    </div>
  );
}
