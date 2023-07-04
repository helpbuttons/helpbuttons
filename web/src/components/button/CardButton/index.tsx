//Main card of the Button that is used inside ButtonFile component and in ButtonNewPublish for the preview. It has all the Data that a button has andd displays it according to the main buttonTemplate and network that buttton selected.
import {
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoHeartOutline,
  IoAddCircleOutline,
} from 'react-icons/io5';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper';

import router from 'next/router';
import { useEffect, useState } from 'react';
import { getShareLink, makeImageUrl } from 'shared/sys.helper';
import { buttonColorStyle, buttonTypes } from 'shared/buttonTypes';
import { ShowWhen } from 'elements/Fields/FieldDate';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';

export default function CardButtonFile({ button }) {
  const { cssColor } = buttonTypes.find((buttonType) => {
    return buttonType.name === button.type;
  });

  return (
    <>
      {button && (
        <>
          <div>
            <div
              className="card-button card-button__file"
              style={buttonColorStyle(cssColor)}
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
  const { cssColor } = buttonTypes.find((buttonType) => {
    return buttonType.name === button.type;
  });
  return (
      <div className="card-button__content">
        <div className="card-button__header">
          <div className="card-button__avatar">
            <div className="avatar-small">
              <ImageWrapper
                imageType={ImageType.avatar}
                src={button.owner.avatar}
                alt={button.title}
              />
            </div>
          </div>

          <div className="card-button__info">
            <div className="card-button__status card-button__status">
              <span
                className="card-button"
                style={buttonColorStyle(cssColor)}
              >
                {button.type}
              </span>
            </div>
            <div className="card-button__name">
              {button.owner.name} @{button.owner.username}
            </div>
          </div>
        </div>

        <div className="card-button__title">{button.title}</div>

        <div className="card-button__city card-button__everywhere ">
          {button.address}
        </div>

        <ShowWhen when={button.when} />

      </div>
  );
}

export function CardButtonHeadSmall({ button }) {
  const { cssColor } = buttonTypes.find((buttonType) => {
    return buttonType.name === button.type;
  });
  return (
    <>
      <a href={`/ButtonFile/${button.id}`}>
        <div className="card-button-map__content">
          <div className="card-button-map__header">
            <div className="card-button-map__info">
              <div className="card-button__name">
                {button.owner.name}
              </div>

              <div className="card-button__status card-button__status">
                <span
                  className="card-button"
                  style={buttonColorStyle(cssColor)}
                >
                  {button.type}
                </span>
              </div>
            </div>
          </div>

          <div className="card-button__title">{button.title}</div>

          <div className="card-button__city card-button__everywhere ">
            {button.address}
          </div>
          <ShowWhen when={button.when} />

        </div>
      </a>
    </>
  );
}

function CardButtonSubmenu({ button }) {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );
  
  const [linkButton, setLinkButton] = useState(null)
  useEffect(() => {
    if(config)
    {
      setLinkButton(() => {
        const shareLink =  getShareLink(`/ButtonFile/${button.id}`);
        return shareLink;
      })
    }
  }, [config])
  return (
    <section>
      <div
        onClick={() => {
          setShowSubmenu(!showSubmenu);
        }}
        className="card-button__edit-icon card-button__submenu"
      ></div>
      {showSubmenu && (
        <div className="card-button__dropdown-container">
          <div className="card-button__dropdown-arrow"></div>

          <datalist
            className="card-button__dropdown-content"
            id="listid"
          >
            <option
              className="card-button__trigger-options"
              label="Share Button"
            ></option>
            <option
              className="card-button__trigger-options card-button__trigger-button"
              label="Copy Link"
              onClick={() => {
                navigator.clipboard.writeText(linkButton);
              }}
            ></option>
            <option
              className="card-button__trigger-options"
              label="Edit Button"
              onClick={() => {
                router.push(`/ButtonEdit/${button.id}`);
              }}
            ></option>
            <option
              className="card-button__trigger-options"
              label="Delete Button"
              onClick={() => {
                router.push(`/ButtonRemove/${button.id}`);
              }}
            ></option>
          </datalist>
        </div>
      )}
    </section>
  );
}
export function CardButtonHeadBig({ button }) {
  const { cssColor } = buttonTypes.find((buttonType) => {
    return buttonType.name === button.type;
  });

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
            <div className="card-button__status card-button__status">
              <span
                className="card-button__status"
                style={buttonColorStyle(cssColor)}
              >
                {button.type}
              </span>
            </div>
            <div className="card-button__name">
              {button.owner.name} @{button.owner.username} 
            </div>
            <CardButtonHeadActions button={button} />
          </div>
        </div>

        <div className="card-button__title">{button.title}</div>

        <div className="card-button__paragraph">
          <p>{button.description}</p>
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

        <div className="card-button__locDate">
          <div className="card-button__city card-button__everywhere ">
            {button.address}
          </div>

          <ShowWhen when={button.when} />
        </div>
      </div>
    </>
  );
}

export function CardButtonHeadActions({ button }) {
  return (
    <div className="card-button__rating">
      {/* <span className="btn-circle__icon">
        <IoHeartOutline />
        {button.hearts}
      </span> */}

      {button.hearts && (
            <span className="btn-circle__icon">
               <IoHeartOutline />
              {button.hearts}
            </span>
          )}

      {button.createdButtonsCount && (
            <span className="btn-circle__icon">
              <IoAddCircleOutline />
              {button.createdButtonsCount}
            </span>
          )}
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
