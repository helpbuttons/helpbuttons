//Main card of the Button that is used inside ButtonFile component and in ButtonNewPublish for the preview. It has all the Data that a button has andd displays it according to the main buttonTemplate and network that buttton selected.
import Image from "next/image";
import {
  IoChevronForwardOutline,
  IoHeartDislikeOutline,
  IoChevronBackOutline,
  IoHeartOutline,
  IoRibbonOutline,
  IoAddCircleOutline,
} from "react-icons/io5";
import ImageWrapper, { ImageType } from "elements/ImageWrapper";

import router from "next/router";
import { useRef } from "store/Store";
import { GlobalState, store } from "pages";
import { useEffect } from "react";
import { FindButton } from "state/Explore";
import { IButton } from "services/Buttons/button.type";
import { makeImageUrl } from "shared/sys.helper";

export default function CardButtonFile() {
  const { id } = router.query;
  // get from the store!!
  const currentButton: IButton = useRef(
    store,
    (state: GlobalState) => state.explore.currentButton
  );


  useEffect(() => {
    if (id != null) {
      store.emit(new FindButton(id));
    }
  }, [id]);

  return (
    <>
      {currentButton && (
        <>
          <div>
            <div
              className={`card-button card-button card-button--${currentButton.type}`}
            >
              <CardButtonHeadBig button={currentButton} />
            </div>
            <CardButtonImages button={currentButton}/>
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
            <div className="card-button__name">{button.owner.name}</div>

            <div className="card-button__status card-button__status">
              <span className={`card-button__status--${button.type}`}>
                {button.type}
              </span>
            </div>
          </div>

          <div className="card-button__submenu card-button__trigger"></div>
        </div>

        <div className="card-button__hashtags">
          {button.tags.map((tag) => {
            return <div className="hashtag">{tag}</div>;
          })}
        </div>

        <div className="card-button__paragraph">
          <p>{button.description}</p>
        </div>

        <div>
          <div className="card-button__city card-button__everywhere ">
            {button.latitude}, {button.longitude}
          </div>

          <div className="card-button__date">Now</div>
        </div>
      </div>
    </>
  );
}
export function CardButtonHeadBig({ button }) {
  return (
    <>
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
            <div className="card-button__name">{button.owner.name}</div>
            <div className="card-button__status card-button__status">
              <span className={`card-button__status--${button.type}`}>
                {button.type}
              </span>
            </div>
            <CardButtonHeadActions button={button}/>
          </div>

          <div className="card-button__submenu card-button__trigger"></div>
        </div>

        <div className="card-button__hashtags">
          {button.tags.map((tag) => {
            return <div className="hashtag">{tag}</div>;
          })}
        </div>

        <div className="card-button__paragraph">
          <p>{button.description}</p>
        </div>

        <div className="card-button__locDate">
          <div className="card-button__city card-button__everywhere ">
            {button.latitude}, {button.longitude}
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
export function CardButtonImages({button}) {
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
          <div className="card-button__trigger-options">Editar botón</div>

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
