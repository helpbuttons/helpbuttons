//Main card of the Button that is used inside ButtonFile component and in ButtonNewPublish for the preview. It has all the Data that a button has andd displays it according to the main buttonTemplate and network that buttton selected.
import {
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoHeartOutline,
  IoAddCircleOutline,
  IoEllipsisHorizontalSharp,
} from 'react-icons/io5';
import t from 'i18n';

import ImageWrapper, { ImageType } from 'elements/ImageWrapper';

import router from 'next/router';
import { useEffect, useState } from 'react';
import { getShareLink, makeImageUrl } from 'shared/sys.helper';
import { buttonColorStyle } from 'shared/buttonTypes';
import { ShowWhen } from 'elements/Fields/FieldDate';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import Link from 'next/link';
import {
  UpdateFiltersToFilterTag,
} from 'state/Explore';

const filterTag = (tag) => {
  store.emit(new UpdateFiltersToFilterTag(tag));
};

export default function CardButtonFile({ button, buttonTypes }) {
  const buttonType = buttonTypes.find((buttonType) => buttonType.name == button.type)

  return (
    <>
      {button && (
        <>
          <div>
            <div
              className="card-button card-button__file"
              style={buttonColorStyle(buttonType.cssColor)}
            >
              <CardButtonHeadBig button={button} buttonTypes={buttonTypes}/>
            </div>
            <CardButtonImages button={button} />
            <CardButtonOptions />
          </div>
        </>
      )}
    </>
  );
}

// card button list on explore
export function CardButtonHeadMedium({ button, buttonType }) {
  
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
              style={buttonColorStyle(buttonType.cssColor)}
            >
               {buttonType.caption}
            </span>
          </div>
          <div className="card-button__name">
              {button.owner.name}<span className="card-button__username"> @{button.owner.username}</span>
          </div>
        </div>
      </div>

      <div className="card-button__title">
        {button.title}
      </div>
      <div className="card-button__hashtags">
        {button.tags.map((tag, idx) => {
          return (
            <div
              className="hashtag"
              key={idx}
            >
              {tag}
            </div>
          );
        })}
      </div>
      <div className="card-button__city card-button__everywhere ">
        {button.address}
      </div>
      <ShowWhen when={button.when} />
    </div>
  );
}

// Pin of the map
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

  const [linkButton, setLinkButton] = useState(null);
  useEffect(() => {
    if (config) {
      setLinkButton(() => {
        const shareLink = getShareLink(`/ButtonFile/${button.id}`);
        return shareLink;
      });
    }
  }, [config]);
  return (
    <section>
      <div
        onClick={() => {
          setShowSubmenu(!showSubmenu);
        }}
        className="card-button__edit-icon card-button__submenu"
      ><IoEllipsisHorizontalSharp /></div>
      {showSubmenu && (
        <div className="card-button__dropdown-container">
          <div className="card-button__dropdown-arrow"></div>

          <div
            className="card-button__dropdown-content"
            id="listid"
          >
              <a
                className="card-button__trigger-options"
              >{t('button.share')}</a>
              <a
                className="card-button__trigger-options card-button__trigger-button"
                onClick={() => {
                  navigator.clipboard.writeText(linkButton);
                }}
              >{t('button.copy')}</a>
              <a
                className="card-button__trigger-options"
                onClick={() => {
                  router.push(`/ButtonEdit/${button.id}`);
                }}
              >{t('button.edit')}</a>
              <a
                className="card-button__trigger-options"
                onClick={() => {
                  router.push(`/ButtonRemove/${button.id}`);
                }}
              >{t('button.delete')}</a>
          </div>
        </div>
      )}
    </section>
  );
}
export function CardButtonHeadBig({ button, buttonTypes }) {
  const { cssColor,caption } = buttonTypes.find((buttonType) => {
    return buttonType.name === button.type;
  });
  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
    false
  );

  const profileHref = (loggedInUser && loggedInUser.username == button.owner.username) ? `/Profile/` : `/Profile/${button.owner.username}`
  return (
    <>
      <CardButtonSubmenu button={button} />

      <div className="card-button__content">
        <div className="card-button__header">
          <div className="card-button__avatar">
            <div className="avatar-big">
            <Link href={profileHref}>
              <ImageWrapper
                imageType={ImageType.avatar}
                src={button.owner.avatar}
                alt="Avatar"
              />
              </Link>
            </div>
            
          </div>

          <div className="card-button__info">
            <div className="card-button__status card-button__status">
              <span
                className="card-button__status"
                style={buttonColorStyle(cssColor)}
              >
                {caption}
              </span>
            </div>
            <div className="card-button__name">
              <Link href={`/Profile/${button.owner.username}`}>
                {button.owner.name} <span className="card-button__username"> @{button.owner.username}</span>
              </Link>
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
              <div className="hashtag" key={idx} onClick={() => {filterTag(tag); router.push('/Explore')}}>
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
        <div className="card-button__edit-icon card-button__submenu"> <IoEllipsisHorizontalSharp /></div>
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
