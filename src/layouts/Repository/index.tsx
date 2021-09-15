//List of elements component that can be used anywhere in the app
import icon from '../../../public/assets/svg/icons/chat.svg'
import iconCross from '../../../public/assets/svg/icons/cross.svg'
import back from '../../../public/assets/svg/icons/back.svg'
import Image from 'next/image'

function Repository() {
  return (
      <div class="repository">
        <div class="repository__content">
          <h1 class="repository__h1">
            List of elements, components and layouts.
          </h1>

          <h2 class="repository__h2">
            List of elements
          </h2>

          <h3 class="repository__title">
            Elements/btn :
          </h3>

          <section class="repository__section">

            <button class="btn-with-icon btn-with-icon--need">
              <div class="btn-filter__icon red"></div>
              <div class="btn-with-icon__text">
                Necesito
              </div>
            </button>

            <button class="btn-with-icon button-with-icon--offer">
              <div class="btn-filter__icon green"></div>
              <div class="btn-with-icon__text">
                Ofrezco
              </div>
            </button>

            <hr></hr>

            <button class="btn-with-icon">
              <div class="btn-filter__split-icon">
                <div class="btn-filter__split-icon--half green-l"></div>
                <div class="btn-filter__split-icon--half red-r"></div>
              </div>
              <div class="button-with-icon__text">
                Intercambio
              </div>
            </button>

            <hr></hr>

            <button class="btn">
              Botón ejemplo
            </button>

            <hr></hr>

            <button class="btn-menu-white">
              Btn picker example
            </button>

            <hr></hr>

            <button class="btn-filter">
              Filtro ejemplo
            </button>

            <hr></hr>

            <button class="btn-filter-with-icon">
              <div class="btn-filter__split-icon">
                <div class="btn-filter__split-icon--half green-l"></div>
                <div class="btn-filter__split-icon--half red-r"></div>
              </div>
              Filter with icon
            </button>

            <hr></hr>

            <button class="btn-filter-with-icon">
              <div class="btn-filter__icon green"></div>
              Filter with icon
            </button>

            <hr></hr>

            <button class="btn-circle">
              <div class="btn-circle__content">
                <Image class="btn-circle__icon" src={icon} alt="icon"/>
              </div>
            </button>

          </section>

          <h3 class="repository__title">
            elements/form
          </h3>
          <hr></hr>

          <section class="repository__section">

            <div class="form-field">
              <input type="text" class="form__input" placeholder="Placeholder"></input>
            </div>

            <hr></hr>

            <div class="form-field">
              <label class="form__label label">
                Text label
              </label>
              <input type="text" class="form__input" placeholder="Placeholder"></input>
            </div>

            <hr></hr>

            <div class="">
              <label class="form__label label">
                Text label
              </label>
              <input type="text" class="form__input--yellow-bg" placeholder="Placeholder"></input>
            </div>

            <hr></hr>

            <div class="form__options-h">
              <div class="form__options-btn">
              CANCEL
              </div>
              <div class="form__options-btn">
                SAVE
              </div>
            </div>

            <hr></hr>

            <div class="form__options-v">
              <div class="form__options-btn">
              CANCEL
              </div>
              <div class="form__options-btn">
                SAVE
              </div>
            </div>

            <hr></hr>

          </section>

          <h3 class="repository__title">
            elements/textarea
          </h3>

          <hr></hr>

          <section class="repository__section">

          <hr></hr>

            <div class="textarea">
              <label class="form__label label">
                Text label
              </label>
              <textarea rows="4" cols="50" class="textarea__textarea" placeholder="Describe yourself here..."></textarea>
            </div>
          </section>

          <h3 class="repository__title">
            elements/dropdown
          </h3>
          <section class="repository__section">

            <div class="dropdown">
              <select class="dropdown__dropdown">
                <option value="volvo" class="picker__options-btn">Volvo</option>
                <option value="volvo" class="picker__options-btn">Option1</option>
                <option value="volvo" class="picker__options-btn">Option2</option>
                <option value="volvo" class="picker__options-btn">Option3</option>
                <option value="volvo" class="picker__options-btn">Option4</option>
                <option value="volvo" class="">Option5</option>
                <option value="volvo" class="">Option6</option>
              </select>
            </div>

            <hr></hr>

            <div class="dropdown">
              <div class="label">label dropdown</div>
              <select class="dropdown__dropdown">
                <option value="volvo" class="select">Volvo</option>
                <option value="volvo" class="">Option1</option>
                <option value="volvo" class="">Option2</option>
                <option value="volvo" class="">Option3</option>
                <option value="volvo" class="">Option4</option>
                <option value="volvo" class="">Option5</option>
                <option value="volvo" class="">Option6</option>
              </select>
            </div>
          </section>

          <h3 class="repository__title">
            elements/checkbox
          </h3>
          <section class="repository__section">
            <div class="label">label checkbox</div>
            <div class="checkbox">
              <label class="checkbox__label">
                <input type="checkbox" class="checkbox__checkbox" id="input-tos"></input>
                <div class="checkbox__content">
                  <div class="checkbox__icon">
                    <Image class="icon" src={icon} alt="icon"/>
                  </div>
                  <div class="checkbox__text">
                    Ahora
                  </div>
                </div>
              </label>
            </div>

            <hr></hr>

            <div class="checkbox">
              <label class="checkbox__label">
                <input type="checkbox" class="checkbox__checkbox" id="input-tos"></input>
                <div class="checkbox__content">
                  <div class="checkbox__icon">
                    <Image class="icon" src={icon} alt="icon"/>
                  </div>
                  <div class="checkbox__text">
                    Fecha/hora concreta
                  </div>
                </div>
              </label>
            </div>

            <hr></hr>

            <div class="checkbox">
              <label class="checkbox__label">
                <input type="checkbox" class="checkbox__checkbox" id="input-tos"></input>
                <div class="checkbox__content">
                  <div class="checkbox__icon">
                    <Image class="icon" src={icon} alt="icon"/>
                  </div>
                  <div class="checkbox__text">
                    Cerca de mi
                  </div>
                </div>
              </label>
            </div>
          </section>

          <h3 class="repository__title">
            elements/text-style
          </h3>
          <section class="repository__section repository__section--yellow">
            <h1 class="title__h1">
              Reference site about Lorem Ipsum,  h1
            </h1>

            <hr></hr>

            <h1 class="title__h2">
              Reference site about Lorem Ipsum,  h2
            </h1>

            <hr></hr>

            <h1 class="title__h3">
              Reference site about Lorem Ipsum,  h3
            </h1>

            <hr></hr>

            <p class="paragraph">
              Lorem ipsum es el texto que se usa habitualmente en <a href="">diseño gráfico en demostraciones</a> de tipografías o de borradores de diseño para probar el diseño visual..
            </p>
          </section>

          <h3 class="repository__title">
            elements/hashtag
          </h3>
          <section class="repository__section">

            <a href="" class="hashtag hashtag--need">example</a>
            <a href="" class="hashtag hashtag--offer">example</a>
            <a href="" class="hashtag hashtag--yellow">example</a>
            <a href="" class="hashtag hashtag--yellow-home">example</a>
            <a href="" class="hashtag hashtag--white">example</a>
            <a href="" class="hashtag">example</a>

          </section>

          <h3 class="repository__title">
            elements/avatar
          </h3>
          <section class="repository__section">
            <picture class="picture">
              <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="avatar picture__img"></img>
            </picture>
          </section>

          <hr></hr>

          <h2 class="repository__h2">
            List of components
          </h2>

          <h3 class="repository__title">
            components/card-button-map
          </h3>
          <section class="repository__section repository__section--yellow">

          <div class="card-button-map card-button-map--need">
            <div class="card-button-map__content">

              <div class="card-button-map__header ">

                <div class="card-button-map__info">

                  <div class="card-button-map__status card-button-map__status">

                        <span class="card-button-map__status--offer">button type</span> y <span class="card-button-map__status--need">button type</span>

                  </div>

                </div>

              </div>

              <div class="card-button-map__hashtags">

                    <div class="card-button-map__busca">
                      <div class="hashtag">tag</div>
                    </div>

              </div>

              <div class="card-button-maps">

                <div class="card-button-map__city card-button-map__everywhere " >
                  En todas partes
                </div>

                <div class="card-button-map__date">
                    Date
                </div>

              </div>

            </div>

            <div class="card-button-map__picture-container">

              <img src="https://dummyimage.com/1000x1000/#ccc/fff" alt="button-picture" class="card-button-map__picture picture__img"></img>

            </div>

          </div>

          </section>

          <h3 class="repository__title">
            components/card-button-list
          </h3>

          <section class="repository__section repository__section--yellow">

          <div class="card-button-list card-button-list--white">

            <div class="card-button-list__picture-container">

              <img src="https://dummyimage.com/1000/#ccc/fff" alt="button-picture" class="card-button-map__picture picture__img"></img>

            </div>

            <div class="card-button-list__content">

              <div class="card-button-list__header">

                <div class="card-button-list__info">

                  <div class="card-button-list__status card-button-list__status">

                    <span class="card-button-list__status--offer">button type</span> y <span class="card-button-list__status--need">button type</span>

                  </div>

                  <div class="card-button-list__status card-button-list__status">

                    <span class="card-button-list__title">Button Name</span>

                  </div>

                </div>

                <div class="card-button-list__submenu card-button-list__trigger">
                </div>

              </div>

              <div class="card-button-list__hashtags">

                    <div class="card-button-list__busca">
                      <div class="hashtag">tag</div>
                    </div>

              </div>

              <div class="card-button-list__paragraph">

                <p>description</p>

                <p class="card-button-list__phone">phone</p>

              </div>

              <div class="card-button-lists">

                <div class="card-button-list__city card-button-list__everywhere " >
                  En todas partes
                </div>

                <div class="card-button-list__date">
                    Date
                </div>

              </div>

            </div>

          </div>

          </section>

          <h3 class="repository__title">
            components/popup-header
          </h3>

          <section class="repository__section repository__section--yellow">


            <div class="popup__header">
              <header class="popup__header-content">
                <div class="popup__header-left">
                  <button class="popup__header-button">
                    <Image class="btn-circle__icon" src={back} alt="icon"/>
                  </button>
                </div>
                <div class="popup__header-center">
                  <h1 class="popup__header-title">
                    Username
                  </h1>
                  <h1 class="popup__header-title">
                    UserTelegram
                  </h1>
                </div>
                <div class="popup__header-right">
                  <button class="popup__header-button">
                    <Image class="btn-circle__icon" src={icon} alt="icon"/>
                  </button>
                </div>
              </header>
            </div>

          </section>

          <h3 class="repository__title">
            components/card-button
          </h3>

          <section class="repository__section repository__section--yellow">


            <div class="card-button card-button card-button--need">
              <div class="card-button__content">

               <div class="card-button__nets">

                       <img src='https://help-buttons-staging.s3.eu-west-3.amazonaws.com/statics/assets/categories/{{net.imgUrl}}.png' alt="" class="card-avatar card-button__net-icon"></img>

               </div>

                <div class="card-button__header">

                  <div class="card-button__avatar">

                    <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="avatar card-avatar picture__img"></img>

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

                <img src="https://dummyimage.com/1000/#ccc/fff" alt="button-picture" class="card-button__picture picture__img"></img>

              </picture>

            </div>

            <div class="">

                <div class="card-button__trigger">
                  <div class="card-button__edit-icon card-button__submenu"></div>
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

                      <button tagName="a" class="card-button__trigger-options card-button__trigger-button">
                        Compartir botón
                      </button>

                      <button tagName="a" class="card-button__trigger-options card-button__trigger-button">
                        Reportar botón
                      </button>

                  </div>

                </div>

            </div>

          </section>

          <h3 class="repository__title">
            components/nav-header
          </h3>

          <section class="repository__section">

            <header class="nav-header nav-header__main">
              <div class="nav-header__left">
                <a href="" class="nav-header__icon">
                x
                </a>
              </div>
              <div class="nav-header__center">
                <h1 class="nav-header__title">
                  Title of page
                </h1>
              </div>
              <div class="nav-header__right">
                <a href="" class="nav-header__icon">
                x
                </a>
              </div>
            </header>

          </section>

          <hr></hr>

          <h3 class="repository__title">
            component/card-notification
          </h3>
          <section class="repository__section">


            <div class="card-notification card-notification--intercambio">
              <div class="card-notification__content">
                <div class="card-notification__avatar">
                  <picture class="picture">
                    <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="avatar picture__img"></img>
                  </picture>
                  <div class="card-notification__icon">
                    <Image class="btn-circle__icon" src={icon} alt="icon"/>
                  </div>
                </div>
                <div class="card-notification__text">
                  <div class="card-notification__header">
                    <div class="card-notification__info">
                      Comentario en #Amigos, #Tarde
                    </div>
                    <div class="card-notification__date">
                      hace 2 días
                    </div>
                  </div>
                  <h2 class="card-notification__title">
                    Jorge
                  </h2>
                  <div class="card-notification__paragraph">
                    Lorem ipsum es el texto que se usa en diseño gráfico en demostraciones...
                  </div>
                </div>
              </div>
            </div>

            <hr></hr>

            <div class="card-notification card-notification--offer">
              <div class="card-notification__content">
                <div class="card-notification__avatar">
                  <picture class="picture">
                    <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="avatar picture__img"></img>
                  </picture>
                  <div class="card-notification__icon">
                    <Image class="btn-circle__icon" src={icon} alt="icon"/>
                  </div>
                </div>
                <div class="card-notification__text">
                  <div class="card-notification__header">
                    <div class="card-notification__info">
                      Comentario en #Amigos, #Tarde
                    </div>
                    <div class="card-notification__date">
                      hace 2 días
                    </div>
                  </div>
                  <h2 class="card-notification__title">
                    Jorge
                  </h2>
                  <div class="card-notification__paragraph">
                    Lorem ipsum es el texto que se usa en diseño gráfico en demostraciones Lorem ipsum es el texto que se usa en diseño gráfico en demostraciones...
                  </div>
                </div>
              </div>
            </div>

            <hr></hr>

            <div class="card-notification card-notification--need">
              <div class="card-notification__content">
                <div class="card-notification__avatar">
                  <picture class="picture">
                    <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="avatar picture__img"></img>
                  </picture>
                  <div class="card-notification__icon">
                    <Image class="btn-circle__icon" src={icon} alt="icon"/>
                  </div>
                </div>
                <div class="card-notification__text">
                  <div class="card-notification__header">
                    <div class="card-notification__info">
                      Comentario en #Amigos, #Tarde
                    </div>
                    <div class="card-notification__date">
                      hace 2 días
                    </div>
                  </div>
                  <h2 class="card-notification__title">
                    Jorge
                  </h2>
                  <div class="card-notification__paragraph">
                    Lorem ipsum es el texto..
                  </div>
                </div>
              </div>
            </div>


        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/card-chat
        </h3>

        <section class="repository__section">

            <div class="card-notification">
              <div class="card-notification__content">
                <div class="card-notification__avatar">
                  <picture class="picture">
                    <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="avatar picture__img"></img>
                  </picture>
                </div>
                <div class="card-notification__text">
                  <div class="card-notification__header">
                    <div class="card-notification__date card-notification__date--nflex">
                      hace 2 días
                    </div>
                  </div>
                  <h2 class="card-notification__title">
                    Jorge
                  </h2>
                  <div class="card-notification__paragraph">
                    Lorem ipsum es el texto..
                  </div>
                  <a class="card-notification__close">
                    <div class="icon-circle"><Image class="" src={iconCross} alt="icon"/></div>
                  </a>
                </div>
              </div>
            </div>


        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/card-profile
        </h3>

        <section class="repository__section">

          <div class="card-profile__container">
          <div class="card-profile__container-avatar-content">
            <figure class="card-profile__avatar-container avatar">
              <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="avatar picture__img"></img>
            </figure>

            <div class="card-profile__content">
              <div class="card-profile__avatar-container-name">
                Username
              </div>
              <figure class="card-profile__rating grid-three">

                <div class="paragraph grid-three__column">
                  90
                  <Image class="btn-circle__icon" src={iconCross} alt="icon"/>

                </div>
                <div class="paragraph grid-three__column">
                  77
                  <Image class="btn-circle__icon" src={iconCross} alt="icon"/>

                </div>
                <div class="paragraph grid-three__column">
                  23
                  <Image class="btn-circle__icon" src={iconCross} alt="icon"/>

                </div>
              </figure>
            </div>
          </div>
          <div class="card-profile__data">
            <div class="card-profile__description grid-one__column-mid-element">
              Descripcion
            </div>

                <div class="card-profile__phone grid-one__column-mid-element">
                  09099190109091
                </div>
            <p class="card-profile__tags grid-one__column-mid-element">
              <div class="hashtag hashtag--yellow">tag</div>
            </p>
          </div>

          <div class="btn-with-icon">
            <div class="btn-with-icon__icon">
              <Image class="btn-circle__icon" src={iconCross} alt="icon"/>
            </div>
            <span class="btn-with-icon__text">
              Cerrar sesión
            </span>
          </div>
        </div>
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/popup-register
        </h3>

        <section class="repository__section">

            <div class="popup">
              <div class="popup__header">
                <header class="popup__header-content">
                  <div class="popup__header-left">
                    <button class="popup__header-button">
                      <Image class="btn-circle__icon" src={back} alt="icon"/>
                    </button>
                  </div>
                  <div class="popup__header-center">
                    <h1 class="popup__header-title">
                      Register
                    </h1>
                  </div>
                  <div class="popup__header-right">
                    <button class="popup__header-button">
                      <Image class="btn-circle__icon" src={icon} alt="icon"/>
                    </button>
                  </div>
                </header>
              </div>

              <div class="popup__content">

                <div class="popup__img">
                  <img src="https://dummyimage.com/550x200/#ccc/fff" alt="Register_img" class=""></img>
                </div>

                <form class="popup__section" onsubmit="">

                  <div class="form-field">
                    <input type="text" class="form__input" placeholder="Escribe tu mail para participar"></input>
                  </div>

                  <button class="btn-with-icon button-with-icon--offer">
                    <div class="btn-filter__icon">
                      <Image class="btn-circle__icon" src={iconCross} alt="icon"/>
                    </div>
                    <div class="btn-with-icon__text">
                      ENTRAR
                    </div>
                  </button>

                </form>

                <div class="popup__options-v">

                  <button class="popup__options-btn">Tengo cuenta</button>

                </div>

              </div>
            </div>
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/dropdown-nets
        </h3>

        <section class="repository__section">

          <input class="dropdown-nets__dropdown-trigger dropdown__dropdown" type='text' list='listid'></input>
          <datalist class="dropdown-nets__dropdown-content" id='listid'>
            <option label='label1' value='Net1'>hola</option>
            <option label='label2' value='Net2'></option>
          </datalist>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/error-message
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/form-chat
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/header-info-overlay
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/header-search
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/marker-button
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/marker-net
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/marker-net
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/message
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/nav-bottom
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/nav-header
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/overlay-loading
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/picker-time
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/picker
        </h3>

        <section class="repository__section">
        </section>

        <hr></hr>

          <h3 class="repository__title">
            component/comments-message
          </h3>
          <section class="repository__section">

            <div class="comments-message__day">
              14 jul 2018
            </div>

            <hr></hr>

            <div class="comments-message comments-message--me">
              <div class="comments-message__content">
                Reference site about Lorem Ipsum, giving information on its origins, as well as ...
              </div>
              <div class="comments-message__hour">
                00:00pm
              </div>
            </div>

            <hr></hr>

            <div class="comments-message comments-message--you">
              <div class="comments-message__content">
                Hello world!
              </div>
              <div class="comments-message__hour">
                00:00pm
              </div>
            </div>
          </section>


          <h3 class="repository__title">
            component/comments-bar
          </h3>
          <section class="repository__section">
            <div class="comments-bar">
              <div class="comments-bar__button">
                Link
              </div>
              <div class="comments-bar__input input">
                <input type="text" class="input__input" placeholder="Placeholder"></input>
              </div>
              <div class="comments-bar__button">
                Link
              </div>
            </div>
          </section>

        </div>
      </div>
  );

}

export default Repository;
