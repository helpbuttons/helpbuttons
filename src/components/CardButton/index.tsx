//Main card of the Button that is used inside ButtonFile component and in ButtonNewPublish for the preview. It has all the Data that a button has andd displays it according to the main buttonTemplate and network that buttton selected.
export default function CardButton() {
  return (

    <div class="card-button card-button card-button--white">
      <div class="card-button__content">

                   <div class="card-button__nets">
                           <img src='https://help-buttons-staging.s3.eu-west-3.amazonaws.com/statics/assets/categories/{{net.imgUrl}}.png' alt="" class="card-avatar card-button__net-icon"></img>
                   </div>

        <div class="card-button__header">

          <div class="card-button__avatar">

                    <div class="card-button__tags card-button__nets">
                        <div class="hashtag card-button__link-net">
                          <img src='https://help-buttons-staging.s3.eu-west-3.amazonaws.com/statics/assets/categories/{{net.imgUrl}}.png' alt="{{net.name}}" class="card-avatar card-button__net-icon"></img>
                        </div>
                    </div>

                    <img src="" alt="Avatar" class="card-avatar picture__img"></img>

          </div>
          <div class="card-button__info">

            <div class="card-button__status card-button__status">

                  <span class="card-button__status--offer">button type</span> y <span class="card-button__status--need">BUSCA</span>

            </div>
            <div class="card-button__name">
              Username
            </div>

          </div>
          <div class="">

              <div class="card-button__trigger">
                <div class="card-button__edit-icon">edit</div>
              </div>

              <div class="card-button__dropdown-container">

                <div class="card-button__dropdown-arrow"></div>
                <div class="card-button__dropdown-content">

                    <div class="card-button__trigger-options">
                      Editar botón
                    </div>

                    <button tagName="a" class="card-button__trigger-options card-button__trigger-button">
                      Quitar botón de la red
                    </button>

                    <button tagName="a" class="card-button__trigger-options card-button__trigger-button">
                      Borrar botón
                    </button>

                    <div class="card-button__trigger-options-input">
                      input for username or email
                    </div>

                    <button tagName="a" class="card-button__trigger-options card-button__trigger-button">
                      Transferir botón
                    </button>

                    <button tagName="a" class="card-button__trigger-options card-button__trigger-button">
                      Compartir botón
                    </button>

                    <button tagName="a" class="card-button__trigger-options card-button__trigger-button">
                      Reportar botón
                    </button>

                </div>

              </div>


          </div>

        </div>
        <div class="card-button__hashtags">

              <div class="card-button__busca">
                <div class="hashtag">tag</div>
              </div>

              <div class="card-button__ofrece">
                <div class="hashtag">tag</div>
              </div>

              <div class="card-button__ofrece">
                <div class="hashtag">hola</div>
              </div>

        </div>

        <div class="card-button__paragraph">

          <p>description</p>

          <p class="card-button__phone">phone</p>

        </div>

        <div class="card-buttons">

          <div class="card-button__city">
            De location

              <span class="card-button__toCity">
                A location name
              </span>
          </div>

          <div class="card-button__city card-button__everywhere " >
            En todas partes
          </div>

          <div class="card-button__city">
            location anme
          </div>

          <div class="card-button__date">
              Date
          </div>

        </div>

      </div>

      <picture class="card-button__picture picture">
        <img alt="Button Image" src=""></img>
      </picture>

    </div>

  );
}
