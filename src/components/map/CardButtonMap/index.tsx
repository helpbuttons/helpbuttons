//The smallest of buttons'cards. It ddisplays over the map when a marker is clicked / touched. Itt was very reduce info, like image, tags, title or other fieldds conidered by the buttonTemplate field.
import ImageWrapper, { ImageType } from 'elements/ImageWrapper'
import CrossIcon from '../../../../public/assets/svg/icons/cross1'
import { Link } from 'elements/Link';

export default function CardButtonMap () {

  return (

    <div className="card-button-map card-button-map--need">

      <div className="card-button-map__content">

        <Link href="/ButtonFile">

          <div className="card-button-map__header ">

            <div className="card-button-map__info">

              <div className="card-button-map__status card-button-map__status">

                    <span className="card-button-map__status--offer">button type</span> y <span className="card-button-map__status--need">button type</span>

              </div>

            </div>

          </div>


          <div className="card-button-map__hashtags">

                <div className="card-button-map__need">
                  <div className="hashtag">tag</div>
                </div>
                <div className="card-button-map__offer">
                  <div className="hashtag">tag</div>
                </div>

          </div>

          <div className="card-button-maps">

            <div className="card-button-map__city card-button-map__everywhere " >
              En todas partes
            </div>

            <div className="card-button-map__date">
                Date
            </div>

          </div>
          
        </Link>

      </div>

      <div className="card-button-map__picture-container">

        <div className="card-button-map__nav">

          <div className="arrow btn-circle__icon">
            <CrossIcon />
          </div>
          <div className="arrow btn-circle__icon">
            <CrossIcon />
          </div>

        </div>

        <div className="card-button-map__picture picture__img">

          <ImageWrapper imageType={ImageType.cardMap} src="https://dummyimage.com/200/#ccc/fff" alt="button-picture"/>

        </div>

      </div>

    </div>


  );
}
