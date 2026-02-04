//The smallest of buttons'cards. It ddisplays over the map when a marker is clicked / touched. Itt was very reduce info, like image, tags, title or other fieldds conidered by the buttonTemplate field.
// import { CardButtonHeadSmall } from "components/button/CardButton";
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { buttonColorStyle, useButtonType } from "shared/buttonTypes";
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { CardButtonState } from "components/button/CardButton";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import { ImageGallery } from "elements/ImageGallery";
export default function CardButtonMap({ button, buttonTypes }) {
  // const {cssColor} = buttonTypes.find((buttonType) => buttonType.name == button.type)
  const buttonType = useButtonType(button, buttonTypes);
  
  const cssColor = 'red'; // TODO
  return (
    <div style={buttonColorStyle(cssColor)}>
      <div className="card-button-map">
        <div className="card-button-map__content">
            {/* <CardButtonState expired={button.expired} awaitingApproval={button.awaitingApproval}/> */}
            <div className="card-button-map__header ">

              <div className="card-button-map__info">

                <div className="card-button-map__status card-button-map__status">
                    {buttonType?.icon && (
                      <div className="card-button__emoji">
                        {buttonType?.icon}
                      </div>
                    )}
                    <span
                      className=""
                    >
                      {buttonType.caption}
                    </span>

                </div>

              </div>

            </div>

            {/* <div className="card-button-map__hashtags">

                  <div className="card-button-map__need">
                    <div className="hashtag">tag</div>
                  </div>

            </div> */}

            <div className="card-button-maps">

              {/* <div className="card-button-map__city card-button-map__everywhere " >
                En todas partes
              </div>

              <div className="card-button-map__date">
                  Date
              </div> */}

            </div>

          </div>
        {/* <CardButtonHeadSmall button={button}/> */}
        <div className="card-button-map__picture-container">
          <div className="card-button-map__nav">


            <Btn
              btnType={BtnType.smallCircle}
              iconLink={<IoChevronBackOutline />}
              iconLeft={IconType.circle}
              contentAlignment={ContentAlignment.center}
              onClick={() => prev()}
              extraClass="arrow"
            />
            <Btn
              btnType={BtnType.smallCircle}
              iconLink={<IoChevronForwardOutline />}
              iconLeft={IconType.circle}
              contentAlignment={ContentAlignment.center}
              onClick={() => next()}
              extraClass="arrow"
            />
          </div>
                    <ImageGallery
                      images={button?.images.map((image) => {
                        return { src: image, alt: button?.description };
                      })}
                    />
   
        </div>
      </div>
    </div>
  );
}
