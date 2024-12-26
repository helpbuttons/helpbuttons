//Card that displays a resume of the button info in tthe List component. Its fieldds can be customizedd according to buttonTemplate.
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { IoChevronForwardOutline, IoLocationOutline, IoTimeOutline } from 'react-icons/io5';
import { IoChevronBackOutline } from 'react-icons/io5';
import { buttonColorStyle } from 'shared/buttonTypes';
import { HiglightHexagonFromButton, updateCurrentButton } from 'state/Explore';
import { store } from 'state';
import router from 'next/router';
import Link from 'next/link';
import { makeImageUrl } from 'shared/sys.helper';

export default function CardButtonFeatured({ buttonTypes, button }) {
  const buttonType = buttonTypes.find(
    (buttonTemplate) => buttonTemplate.name == button.type,
  );
  if(!buttonType)
  {
    console.error(`type of button not found '${button.type}'`)
  }
  return (
    <>
   
                <div className="featured-card__container">
                  <p className="featured-card__hr"></p>
                  <div className="featured-card__content">
                    <Link href={`Explore/17/${button.latitude}/${button.longitude}/?btn=${button.id}`}>
                      <img src={makeImageUrl(button.image)} alt="Imagen 1" className="featured-card__content-image" />
                    </Link>
                    <div>
                      <div className="featured-card__content-user">
                        <img src={makeImageUrl(button.owner.avatar)} alt="Imagen 1" className="featured-card__content-avatar" />
                        <div>
                          <div className="featured-card__content-type">
                            {button.type}
                          </div>
                          <div className="featured-card__content-userdata">
                            <span>{button.owner.username}</span>
                            <span>@{button.owner.username}@server</span>
                          </div>
                        </div>
                      </div>

                      <div className="featured-card__content-description">
                        {button.description}
                      </div>

                      <div className="featured-card__content-tags">
                        {button.tags.map(tag => { return <div className="hashtag">{tag}</div> })}
                      </div>

                      <div className="featured-card__content-address">
                        <IoLocationOutline /> {button.address}
                      </div>
                      <div className="featured-card__content-time">
                        <IoTimeOutline /> now
                      </div>
                    </div>
                  </div>
                </div>
    </>
  );
}
