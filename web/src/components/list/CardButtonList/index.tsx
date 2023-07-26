//Card that displays a resume of the button info in tthe List component. Its fieldds can be customizedd according to buttonTemplate.
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { IoChevronBackOutline } from 'react-icons/io5';
import { Link } from 'elements/Link';
import { CardButtonHeadMedium } from 'components/button/CardButton';
import { buttonColorStyle } from 'shared/buttonTypes';

export default function CardButtonList({buttonTypes, button }) {
  const buttonTemplate = buttonTypes.find((buttonTemplate) => buttonTemplate.name == button.type)
  
    
  return (
    <>
      <div className="list__element">
        <div style={buttonColorStyle(buttonTemplate.cssColor)}>
          <Link href={`/ButtonFile/${button.id}`}>
            <div className="card-button-list">
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
                  src={button.image}
                  alt={button.description}
                />
              </div>
              <div className="card-button-list__content">
                <CardButtonHeadMedium button={button} buttonTemplate={buttonTemplate}/>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
