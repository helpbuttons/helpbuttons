//The smallest of buttons'cards. It ddisplays over the map when a marker is clicked / touched. Itt was very reduce info, like image, tags, title or other fieldds conidered by the buttonTemplate field.
// import { CardButtonHeadSmall } from "components/button/CardButton";
import { useButtonType } from "shared/buttonTypes";
import { CardButtonHeadSmall } from "components/button/CardButton";
import { ImageGalleryMap } from "elements/ImageGallery";

export default function CardButtonMap({ button, buttonTypes, onClick }) {
    const buttonType = useButtonType(button, buttonTypes);

  return (
    < >
      <div className="card-button-map" onClick={onClick}>
        <CardButtonHeadSmall buttonType={buttonType} button={button} />
        <div className="card-button-map__picture-container">
          <ImageGalleryMap
            images={button?.images.map((image) => {
              return { src: image, alt: button.description };
            })}
          />
        </div>
      </div>
    </>
  );
}
