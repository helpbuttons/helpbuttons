//Main card of the Button that is used inside ButtonFile component and in ButtonNewPublish for the preview. It has all the Data that a button has andd displays it according to the main buttonTemplate and network that buttton selected.
import {
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoHeartOutline,
  IoAddCircleOutline,
} from 'react-icons/io5';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';

import router from 'next/router';
import {  useState } from 'react';
import { getShareLink, makeImageUrl } from 'shared/sys.helper';


export default function CardButtonFile({button}) {
  

  return (
    <>
      {button && (
        <>
          <div>
            <div
              className={`card-button card-button card-button--${button.type}`}
            >
              <CardButtonHeadBig button={button} />
            </div>
            <CardButtonImages button={button} />
            <CardButtonOptions />
          </div>
        </>
      )}
    </>
  );
}

export function CardButtonHeadMedium({ button }) {
  return (
    <>
      <CardButtonSubmenu button={button} />
      <a href={`/ButtonFile/${button.id}`}>
        <div className="card-button__content">
          <div className="card-button__header">
            <div className="card-button__avatar">
              <div className="avatar-medium">
                <ImageWrapper
                  imageType={ImageType.avatar}
                  src={button.owner.avatar}
                  alt="Avatar"
                />
              </div>
            </div>

            <div className="card-button__info">
              <div className="card-button__name">
                {button.owner.name}
              </div>

              <div className="card-button__status card-button__status">
                <span
                  className={`card-button__status--${button.type}`}
                >
                  {button.type}
                </span>
              </div>
            </div>
          </div>

          <div className="card-button__hashtags">
            {button.tags.map((tag, idx) => {
              return (
                <div className="hashtag" key={idx}>
                  {tag}
                </div>
              );
            })}
          </div>

          <div className="card-button__paragraph">
            <p>{button.description}</p>
          </div>

          <div>
            <div className="card-button__city card-button__everywhere ">
              {button.address}
            </div>

            <div className="card-button__date">Now</div>
          </div>
        </div>
      </a>
    </>
  );
}

function CardButtonSubmenu({ button }) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const linkButton = getShareLink(`/Button/${button.id}`);
  return (
    <section>
      <div
        onClick={() => {
          setShowSubmenu(!showSubmenu);
        }}
        className="card-button__edit-icon card-button__submenu"
      ></div>
      {showSubmenu && (
        <datalist
          className="dropdown-nets__dropdown-content"
          id="listid"
        >
          <option
            className="dropdown-nets__dropdown-option"
            label="Share Button"
          ></option>
          <option
            className="dropdown-nets__dropdown-option"
            label="Copy Link"
            onClick={() => {
              navigator.clipboard.writeText(linkButton);
            }}
          ></option>
          <option
            className="dropdown-nets__dropdown-option"
            label="Edit Button"
            onClick={() => {
              router.push(`/ButtonEdit/${button.id}`);
            }}
          ></option>
          <option
            className="dropdown-nets__dropdown-option"
            label="Delete Button"
            onClick={() => {
              router.push(`/ButtonRemove/${button.id}`);
            }}
          ></option>
        </datalist>
      )}
    </section>
  );
}
export function CardButtonHeadBig({ button }) {
  return (
    <>
      <CardButtonSubmenu button={button} />

      <div className="card-button__content">
        <div className="card-button__header">
          <div className="card-button__avatar">
            <div className="avatar-big">
              <ImageWrapper
                imageType={ImageType.avatar}
                src={button.owner.avatar}
                alt="Avatar"
              />
            </div>
          </div>

          <div className="card-button__info">
            <div className="card-button__name">
              {button.owner.name}
            </div>
            <div className="card-button__status card-button__status">
              <span className={`card-button__status--${button.type}`}>
                {button.type}
              </span>
            </div>
            <CardButtonHeadActions button={button} />
          </div>
        </div>

        <div className="card-button__hashtags">
          {button.tags.map((tag, idx) => {
            return <div className="hashtag" key={idx}>{tag}</div>;
          })}
        </div>

        <div className="card-button__paragraph">
          <p>{button.description}</p>
        </div>

        <div className="card-button__locDate">
          <div className="card-button__city card-button__everywhere ">
            {button.address}
          </div>

          <div className="card-button__date">Now</div>
        </div>
      </div>
    </>
  );
}

export function CardButtonHeadActions({ button }) {
  return (
    <div className="card-button__rating">
      <span className="btn-circle__icon">
        <IoHeartOutline />
        {button.hearts}
      </span>

      <span className="btn-circle__icon">
        <IoAddCircleOutline />
        {button.createdButtonsCount}
      </span>
    </div>
  );
}
export function CardButtonImages({ button }) {
  return (
    <div className="card-button__picture">
      <div className="card-button__picture-nav">
        <div className="arrow btn-circle__icon">
          <IoChevronBackOutline />
        </div>
        <div className="arrow btn-circle__icon">
          <IoChevronForwardOutline />
        </div>
      </div>
      <ImageWrapper
        imageType={ImageType.buttonCard}
        src={makeImageUrl(button.image)}
        alt={button.description}
      />
    </div>
  );
}
export function CardButtonOptions() {
  return (
    <div className="card-button__options-menu">
      <div className="card-button__trigger">
        <div className="card-button__edit-icon card-button__submenu"></div>
      </div>

      <div className="card-button__dropdown-container">
        <div className="card-button__dropdown-arrow"></div>
        <div className="card-button__dropdown-content">
          <div className="card-button__trigger-options">
            Editar botón
          </div>

          <button className="card-button__trigger-options card-button__trigger-button">
            Quitar botón de la red
          </button>

          <button className="card-button__trigger-options card-button__trigger-button">
            Borrar botón
          </button>

          <button className="card-button__trigger-options card-button__trigger-button">
            Compartir botón
          </button>

          <button className="card-button__trigger-options card-button__trigger-button">
            Reportar botón
          </button>
        </div>
      </div>
    </div>
  );
}
