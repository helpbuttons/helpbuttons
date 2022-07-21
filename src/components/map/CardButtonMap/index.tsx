//The smallest of buttons'cards. It ddisplays over the map when a marker is clicked / touched. Itt was very reduce info, like image, tags, title or other fieldds conidered by the buttonTemplate field.
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { Link } from "elements/Link";

export default function CardButtonMap({ type, userName, images, tags, description, location, date }) {
  return (
    <div className="card-button-map card-button-map--need">
      <div className="card-button-map__content">
        <Link href="/ButtonFile">
          <div className="card-button-map__header ">
            <div className="card-button-map__info">
              <div className="card-button-map__status card-button-map__status">
                {(type === "offer") && (
                  <span className="card-button-map__status--offer">{type}</span>
                )}
                {(type === "need") && (
                  <span className="card-button-map__status--need">{type}</span>
                )}
                {(type === "exchange") && (
                  <span className="card-button-map__status--exchange">{type}</span>
                )}
              </div>
            </div>
          </div>

          {(tags.length > 0) && (
            <div className="card-button-map__hashtags">
              {tags.map((tag, i) => (
                <div key={i} className="card-button-map__need">
                  <div className="hashtag">{tag}</div>
                </div>
              ))}
            </div>
          )}

          <div className="card-button-maps">
              {description}
          </div>
          <div className="card-button-maps">
            <div className="card-button-map__city card-button-map__everywhere ">
              {JSON.stringify(location.coordinates)}
            </div>
            <div className="card-button-map__date">{date}</div>
          </div>
        </Link>
      </div>

      <div className="card-button-map__picture-container">
        <div className="card-button-map__nav">
          <div className="arrow btn-circle__icon">
            <IoChevronBackOutline />
          </div>
          <div className="arrow btn-circle__icon">
            <IoChevronForwardOutline />
          </div>
        </div>

        <div className="card-button-map__picture picture__img">
          <ImageWrapper
            imageType={ImageType.cardMap}
            alt={description}
          />
        </div>
      </div>
    </div>
  );
}
