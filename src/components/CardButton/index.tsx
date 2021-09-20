//Main card of the Button that is used inside ButtonFile component and in ButtonNewPublish for the preview. It has all the Data that a button has andd displays it according to the main buttonTemplate and network that buttton selected.
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'


export default function CardButton() {
  return (

    <>

          <div class="card-button card-button card-button--need">

            <div class="card-button__content">

             <div class="card-button__nets">

               <img src='https://help-buttons-staging.s3.eu-west-3.amazonaws.com/statics/assets/categories/{{net.imgUrl}}.png' alt="" class="card-avatar card-button__net-icon"></img>

             </div>

              <div class="card-button__header">

                <div class="card-button__avatar">

                  <div class="avatar-big">
                    <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="picture__img"></img>
                  </div>

                </div>

                <div class="card-button__info">

                  <div class="card-button__status card-button__status">

                    <span class="card-button__status--offer">button type</span> y <span class="card-button__status--need">button type</span>

                  </div>

                  <div class="card-button__name">
                    Username
                  </div>

                </div>

                <div class="card-button__submenu card-button__trigger">
                </div>


              </div>

              <div class="card-button__hashtags">

                    <div class="card-button__busca">
                      <div class="hashtag">tag</div>
                    </div>

              </div>

              <div class="card-button__paragraph">

                <p>description</p>

                <p class="card-button__phone">phone</p>

              </div>

              <div class="card-buttons">

                <div class="card-button__city card-button__everywhere " >
                  En todas partes
                </div>

                <div class="card-button__date">
                    Date
                </div>

              </div>

            </div>

            <picture class="card-button__picture picture">

              <div class="card-button__picture-nav">

                <div class="arrow btn-circle__icon">
                  <CrossIcon />
                </div>
                <div class="arrow btn-circle__icon">
                  <CrossIcon />
                </div>

              </div>

              <img src="https://dummyimage.com/1000/#ccc/fff" alt="button-picture" class="card-button__picture picture__img"></img>

            </picture>

          </div>

          <div class="card-button__options-menu">

            <div class="card-button__trigger">
              <div class="card-button__edit-icon card-button__submenu"></div>
            </div>

            <div class="card-button__dropdown-container">
              <div class="card-button__dropdown-arrow"></div>
              <div class="card-button__dropdown-content">

                <div class="card-button__trigger-options">
                  Editar botón
                </div>

                <button  class="card-button__trigger-options card-button__trigger-button">
                  Quitar botón de la red
                </button>

                <button  class="card-button__trigger-options card-button__trigger-button">
                  Borrar botón
                </button>

                <button  class="card-button__trigger-options card-button__trigger-button">
                  Compartir botón
                </button>

                <button  class="card-button__trigger-options card-button__trigger-button">
                  Reportar botón
                </button>
              </div>
            </div>

          </div>


    </>

  );
}
