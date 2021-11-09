//Main card of the Button that is used inside ButtonFile component and in ButtonNewPublish for the preview. It has all the Data that a button has andd displays it according to the main buttonTemplate and network that buttton selected.
import Image from 'next/image'
import { IoChevronForwardOutline } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import ImageWrapper, { ImageType } from 'elements/ImageWrapper'
import { IoPersonOutline } from "react-icons/io5";
import { IoHeartOutline } from "react-icons/io5";
import { IoRibbonOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { IoHammerOutline } from "react-icons/io5";

export default function CardButton() {
  return (

    <>

          <div className="card-button card-button card-button--need">

            <div className="card-button__content">

             <div className="card-button__nets">

               <ImageWrapper imageType={ImageType.buttonCard} src="https://dummyimage.com/80/#ccc/fff" alt="Avatar"/>

             </div>

              <div className="card-button__header">

                <div className="card-button__avatar">

                  <div className="avatar-big">
                    <ImageWrapper imageType={ImageType.avatar} src="https://dummyimage.com/80/#ccc/fff" alt="Avatar"/>
                  </div>

                </div>

                <div className="card-button__info">

                  <div className="card-button__status card-button__status">

                    <span className="card-button__status--offer">button type</span> y <span className="card-button__status--need">button type</span>

                  </div>

                  <div className="card-button__name">
                    Username
                  </div>

                  <figure className="card-button__rating grid-three">

                    <div className="paragraph grid-three__column">

                      90
                      <div className="btn-circle__icon">
                        <IoHeartOutline />
                      </div>
                    </div>
                    <div className="paragraph grid-three__column">
                      77
                      <div className="btn-circle__icon">
                        <IoPersonOutline />
                      </div>
                    </div>
                    <div className="paragraph grid-three__column">
                      23
                      <div className="btn-circle__icon">
                        <IoRibbonOutline />
                      </div>

                    </div>

                  </figure>

                </div>

                <div className="card-button__submenu card-button__trigger">
                </div>


              </div>

              <div className="card-button__hashtags">

                    <div className="card-button__busca">
                      <div className="hashtag">tag</div>
                    </div>

              </div>

              <div className="card-button__paragraph">

                <p>description</p>

                <p className="card-button__phone">phone</p>

              </div>

              <div className="card-button__locDate">

                <div className="card-button__city card-button__everywhere " >
                  Place
                </div>

                <div className="card-button__date">
                    Date
                </div>

              </div>

            </div>

            <div className="card-button__picture">

              <div className="card-button__picture-nav">

                <div className="arrow btn-circle__icon">
                  <IoChevronBackOutline />
                </div>
                <div className="arrow btn-circle__icon">
                  <IoChevronForwardOutline />
                </div>

              </div>

              <ImageWrapper imageType={ImageType.buttonCard} src="https://dummyimage.com/1000/#ccc/fff" alt="Avatar"/>

            </div>

          </div>

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

                <button  className="card-button__trigger-options card-button__trigger-button">
                  Quitar botón de la red
                </button>

                <button  className="card-button__trigger-options card-button__trigger-button">
                  Borrar botón
                </button>

                <button  className="card-button__trigger-options card-button__trigger-button">
                  Compartir botón
                </button>

                <button  className="card-button__trigger-options card-button__trigger-button">
                  Reportar botón
                </button>
              </div>
            </div>

          </div>


    </>

  );
}
