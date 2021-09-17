//List of elements component that can be used anywhere in the app
import icon from '../../../public/assets/svg/icons/chat.svg'
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'
import back from '../../../public/assets/svg/icons/back.svg'
import hand from '../../../public/assets/svg/icons/hand_call.svg'
import send from '../../../public/assets/svg/icons/send.svg'
import atta from '../../../public/assets/svg/icons/atta.svg'

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

            <button disabled class="btn-with-icon button-with-icon--offer">
              <div class="btn-filter__icon green"></div>
              <div class="btn-with-icon__text">
                Ofrezco inactivo
              </div>
            </button>

            <hr></hr>

            <button class="btn-with-icon">
              <div class="btn-filter__split-icon">
                <div class="btn-filter__split-icon--half green-l"></div>
                <div class="btn-filter__split-icon--half red-r"></div>
              </div>
              <div class="btn-with-icon__text">
                Intercambio
              </div>
            </button>

            <hr></hr>

            <button class="btn">
              Botón ejemplo sin icono
            </button>

            <hr></hr>

            <button class="btn btn--black btn--center">
              Botón ejemplo negro centrado
            </button>

            <hr></hr>

            <button class="btn btn--corporative btn--center">
              Botón ejemplo corp
            </button>

            <hr></hr>

            <button class="btn-filter">
              Filter example
            </button>

            <hr></hr>

            <button disabled class="btn-filter">
              Filter example
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
                <div class="btn-circle__icon">
                  <CrossIcon />
                </div>
              </div>
            </button>

            <button disabled class="btn-circle">
              <div class="btn-circle__content">
                <div class="btn-circle__icon">
                  <CrossIcon />
                </div>
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
              <input type="text" class="form__input--dark-bg" placeholder="Placeholder"></input>
              <div class="form__input-subtitle">
                <div class="form__input-subtitle-side">
                  <label class="form__input-subtitle--error">
                    Notes in this side to explain the field, also errors
                  </label>
                  <label class="form__input-subtitle--text">
                    Notes in this side to explain the field, also errors
                  </label>
                </div>
                <div class="form__input-subtitle-side">
                  <a href="" class="form__input-subtitle--text link">
                    Links to other extra functions on this side
                  </a>
                </div>
              </div>
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

            <div class="form__options-h">

              <div class="form__options-text">
                Explain something
              </div>
              <div class="form__options-btn">
              CANCEL
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

          <section class="repository__section">

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

            <div class="dropdown-select">
              <div class="label">label dropdown</div>
              <select class="dropdown-select__trigger">
                <option value="volvo" class="dropdown-select__option">Volvo</option>
                <option value="volvo" class="dropdown-select__option">Option1</option>
                <option value="volvo" class="dropdown-select__option">Option2</option>
                <option value="volvo" class="dropdown-select__option">Option3</option>
                <option value="volvo" class="dropdown-select__option">Option4</option>
                <option value="volvo" class="dropdown-select__option">Option5</option>
                <option value="volvo" class="dropdown-select__option">Option6</option>
              </select>
            </div>

            <hr></hr>

            <input class="dropdown-nets__dropdown-trigger dropdown__dropdown" autocomplete="off"  id="input" name="browsers" placeholder="Search Network" type='text' list='listid'></input>
            <datalist class="dropdown-nets__dropdown-content" id='listid'>
              <option class="dropdown-nets__dropdown-option" label='label1' value='Net1'>hola</option>
              <option class="dropdown-nets__dropdown-option" label='label2' value='Net2'>hola</option>
              <option class="dropdown-nets__create-new-button" label='label2' value='Net2'>Create Net</option>
            </datalist>

            <hr></hr>

            <input class="dropdown__dropdown" autocomplete="off" list="browsers" id="input" name="browsers" placeholder="Search Tag"></input>
              <datalist class="dropdown-nets__dropdown-content" id='browsers'>
                <option value="tag1" class="dropdown-nets__dropdown-option" label='label1'>tag</option>
                <option value="tag2" class="dropdown-nets__dropdown-option" label='label2'>Option1</option>
                <option value="tag3" class="dropdown-nets__dropdown-option" label='label3'>Option2</option>
                <option value="tag4" class="dropdown-nets__dropdown-option" label='label4'>Option3</option>
                <option value="tag5" class="dropdown-nets__dropdown-option" label='label5'>Option4</option>
                <option value="tag6" class="dropdown-nets__dropdown-option" label='label1'>Option5</option>
                <option value="tag7" class="dropdown-nets__dropdown-option" label='label1'>Option6</option>
              </datalist>

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
                    <CrossIcon />
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
                    <CrossIcon />
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
                    <CrossIcon />
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

            <div class="avatar-medium">
              <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" class="picture__img"></img>
            </div>

            <div class="avatar-big">
              <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="picture__img"></img>
            </div>

            <div class="avatar-small">
              <img src="https://dummyimage.com/30/#ccc/fff" alt="Avatar" class="picture__img"></img>
            </div>

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

              <div class="card-button-map__nav">

                <div class="arrow btn-circle__icon">
                  <CrossIcon />
                </div>
                <div class="arrow btn-circle__icon">
                  <CrossIcon />
                </div>

              </div>

              <img src="https://dummyimage.com/500x250/#ccc/fff" alt="button-picture" class="card-button-map__picture picture__img"></img>

            </div>

          </div>

          </section>

          <h3 class="repository__title">
            components/card-button-list
          </h3>

          <section class="repository__section repository__section--yellow">

          <div class="card-button-list card-button-list--need">

            <div class="card-button-list__picture-container">

              <div class="card-button-list__nav">

                <div class="arrow btn-circle__icon">
                  <CrossIcon />
                </div>
                <div class="arrow btn-circle__icon">
                  <CrossIcon />
                </div>

              </div>

              <img src="https://dummyimage.com/1000/#ccc/fff" alt="button-picture" class="picture__img"></img>

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
                    <div class="btn-circle__icon">
                      <CrossIcon />
                    </div>
                  </button>
                </div>
                <div class="popup__header-center">
                  <h1 class="popup__header-title">
                    Username
                  </h1>
                </div>
                <div class="popup__header-right">
                  <button class="popup__header-button">
                    <div class="btn-circle__icon">
                      <CrossIcon />
                    </div>
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

          </section>

          <hr></hr>

          <h3 class="repository__title">
            component/card-notification
          </h3>
          <section class="repository__section">

            <div class="card-notification card-notification--intercambio">
              <div class="card-notification__content">
                <div class="card-notification__avatar">

                  <div class="avatar-medium">
                    <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" class="picture__img"></img>
                  </div>

                  <div class="card-notification__icon">
                    <CrossIcon />
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
                  <div class="avatar-medium">
                    <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" class="picture__img"></img>
                  </div>
                  <div class="card-notification__icon">
                    <CrossIcon />
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
                  <div class="avatar-medium">
                    <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" class="picture__img"></img>
                  </div>
                  <div class="card-notification__icon">
                    <CrossIcon />
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
                  <div class="avatar-medium">
                    <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" class="picture__img"></img>
                  </div>
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
                </div>
                <button class="btn-circle card-notification__delete">
                  <div class="btn-circle__content">
                    <div class="btn-circle__icon">
                      <CrossIcon />
                    </div>
                  </div>
                </button>
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
              <div class="avatar-big">
                <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="picture__img"></img>
              </div>
            </figure>

            <div class="card-profile__content">
              <div class="card-profile__avatar-container-name">
                Username
              </div>
              <figure class="card-profile__rating grid-three">

                <div class="paragraph grid-three__column">
                  90
                  <div class="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
                <div class="paragraph grid-three__column">
                  77
                  <div class="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
                <div class="paragraph grid-three__column">
                  23
                  <div class="btn-circle__icon">
                    <CrossIcon />
                  </div>

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
              <CrossIcon />
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
                      <div class="btn-circle__icon">
                        <CrossIcon />
                      </div>
                    </button>
                  </div>
                  <div class="popup__header-center">
                    <h1 class="popup__header-title">
                      Register
                    </h1>
                  </div>
                  <div class="popup__header-right">
                    <button class="popup__header-button">
                      <div class="btn-circle__icon">
                        <CrossIcon />
                      </div>
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
                      <CrossIcon />
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

          <input class="dropdown-nets__dropdown-trigger dropdown__dropdown" autocomplete="off" list="" id="input" name="browsers" placeholder="Select Network" type='text'></input>
          <datalist class="dropdown-nets__dropdown-content" id='listid'>
            <option class="dropdown-nets__dropdown-option" label='label1' value='Net1'>hola</option>
            <option class="dropdown-nets__dropdown-option" label='label2' value='Net2'>hola</option>
            <option class="dropdown-nets__create-new-button" label='label2' value='Net2'>Create Net</option>
          </datalist>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/error-message
        </h3>

        <section class="repository__section">

        <div class="error-message">

          <div class="error-message__icon">
            <CrossIcon />
          </div>
          <div class="">
            <p class="error-message__top-text">Error</p>
            <h4 class="error-message__title">
              Titulo error
            </h4>
            <p class="error-message__subtitle">
              Error mensaje
            </p>
          </div>

        </div>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/form-chat
        </h3>

        <section class="repository__section">

          <form class="chats__new-message" onsubmit="">

              <button class="btn-circle">
                <div class="btn-circle__content">
                  <div class="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
              </button>
              <div class="chats__new-message-message">
                <input class="form__input chats__new-message-input"></input>
              </div>
              <button class="btn-circle">
                <div class="btn-circle__content">
                  <div class="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
              </button>

          </form>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/header-info-overlay
        </h3>

        <section class="repository__section">
            not defined as component
        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/header-search
        </h3>

        <section class="repository__section">

          <div class="header-search__tool">

            <form class="header-search__form" onsubmit="return false;">

              <div class="header-search__column">

                <div class="header-search__label">Qué</div>
                <input type="text" class="header-search--tags" placeholder='Selecciona fecha'></input>

              </div>

              <div class="header-search__column">

                  <div class="header-search__label">Dónde</div>
                  <input type="text" class="header-search--location" placeholder='Selecciona lugar'></input>

              </div>

              <div class="header-search__column">

                <div class="header-search__label">Cuándo</div>
                <input type="text" class="header-search--time" placeholder='Selecciona fecha'></input>

              </div>

            </form>

          </div>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/marker-button
        </h3>

        <section class="repository__section">

          <figure id='markerButton' class="marker-button marker-button--need">
            <div class="avatar-medium marker-button__image">
              <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" class="picture__img"></img>
            </div>
            <span class="marker-button__arrow"></span>
            <div class="marker-button__tags marker-button__tags--need">
                <div class="marker-button__link-tag">
                  tag
                </div>
            </div>

          </figure>

        </section>

        <hr></hr>

        <section class="repository__section">

          <figure id='markerButton' class="marker-button marker-button--need marker-button--name-alone">
            <span class="marker-button__arrow"></span>
            <div class="marker-button__tags--need">
                <div class="marker-button__link-tag--alone">
                  palabras
                </div>
            </div>

          </figure>

        </section>

        <hr></hr>


        <h3 class="repository__title">
          component/marker-net
        </h3>

        <section class="repository__section">

          <figure id='markerNet' class="marker-net">
            <div class="avatar-medium marker-net__image">
              <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" class="picture__img"></img>
            </div>
            <span class="marker-net__arrow"></span>
            <div class="marker-net__name">
                <div class="marker-net__link-name">
                  netname
                </div>
            </div>

          </figure>

        </section>

        <hr></hr>

        <section class="repository__section">

          <figure id='markerButton' class="marker-net marker-net--need marker-net--name-alone">
            <span class="marker-net__arrow"></span>
            <div class="marker-net__name">
                <div class="marker-net__link-name--alone">
                  netname
                </div>
            </div>

          </figure>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/message
        </h3>

        <section class="repository__section">

          <div class="message message--me">

            <div class="message__content">
              message
            </div>
            <div class="message__hour">
              00:00
            </div>

          </div>

          <hr></hr>

          <div class="message message--you">

            <div class="message__header">

                <div class="message__avatar">
                  <img src="https://dummyimage.com/30/#ccc/fff" alt="Avatar" class="avatar picture__img"></img>
                </div>

              <div class="message__user-name-container">
                <p class="message__user-name">Username</p>
              </div>

            </div>

            <div class="message__content">
              message
            </div>

            <div class="message__hour">
              00:00
            </div>

          </div>

          <hr></hr>

          <div class="message message--you">

            <div class="message__content">
              message
            </div>

            <div class="message__hour">
              00:00
            </div>

          </div>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/nav-bottom
        </h3>

        <section class="repository__section">

          <div id="bottom-nav" class="nav-bottom">

            <a href="" class="nav-bottom__link nav-bottom__link--active">
                <div class="nav-bottom__icon">
                    <CrossIcon />
                </div>
                <div class="nav-bottom__text">
                  Mapa
                </div>
            </a>

            <a href="" class="nav-bottom__link nav-bottom__link--active">
                <div class="nav-bottom__icon">
                    <CrossIcon />
                </div>
                <div class="nav-bottom__text">
                  Mapa
                </div>
            </a>

            <a href="" class="nav-bottom__link nav-bottom__link--create">
                <div class="nav-bottom__icon">
                    <CrossIcon />
                </div>
            </a>

            <a href="" class="nav-bottom__link nav-bottom__link--active">
                <div class="nav-bottom__icon">
                    <CrossIcon />
                </div>
                <div class="nav-bottom__text">
                  Login
                </div>
            </a>

            <a href="" class="nav-bottom__link nav-bottom__link--active">
                <div class="nav-bottom__icon">
                    <CrossIcon />
                </div>
                <div class="nav-bottom__text">
                  Profile
                </div>
            </a>

          </div>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/nav-header
        </h3>

        <section class="repository__section">

          <form class="nav-header__content" onsubmit="">

              <button class="btn-circle">
                <div class="btn-circle__content">
                  <div class="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
              </button>

              <div class="nav-header__content-message">
                <input class="form__input nav-header__content-input" placeholder="Search tags"></input>
              </div>

              <button class="btn-circle">
                <div class="btn-circle__content">
                  <div class="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
              </button>

          </form>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/overlay-loading
        </h3>

        <section class="repository__section">

        <div class="spinner-overlay">
          <figure class="btn-circle">
            <div class="loading-overlay__loading-icon spinner">
              <CrossIcon />
            </div>
          </figure>
        </div>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/picker
        </h3>

        <section class="repository__section">

          <div class="picker">
            <div class="picker--over picker-box-shadow picker__content picker__options-v">
              <button  class="picker__option-btn--active" type="button" name="button">
                  <div class="picker__option-btn--icon">
                    <CrossIcon />
                  </div>
                  <div class="picker__option-btn--txt">
                    Ahora
                  </div>
              </button>
              <button  class="picker__option-btn--active" type="button" name="button">
                  <div class="picker__option-btn--icon">
                    <CrossIcon />
                  </div>
                  <div class="picker__option-btn--txt">
                    Fecha / hora concreta
                  </div>
              </button>
              <button  class="picker__option-btn-with-icon" type="button" name="button">
                  <div class="picker__option-btn--icon">
                    <CrossIcon />
                  </div>
                  <div class="picker__option-btn--txt">
                    Fecha / hora concreta
                  </div>
              </button>
            </div>
          </div>

        </section>

        <hr></hr>

        <h3 class="repository__title">
          component/picker-time
        </h3>

        <section class="repository__section">

          <div class="picker__content">
            <div class="picker__section">
              <header class="picker__header ">
                  Selecciona días de la semana y hora
              </header>
              <div class="picker__row">

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div class="picker-time__selected">

                <div class="picker-time__dropdown">
                    <div class="picker-time__dropdown-trigger">
                      00
                    </div>
                    <div class="picker-time__dropdown-content">
                      <div class="picker-time__dropdown-option">
                        00
                      </div>
                    </div>
                </div>

                <span class="picker-time__points">:</span>

                <div class="picker-time__dropdown">
                    <div class="picker-time__dropdown-trigger">
                      00
                    </div>
                    <div class="picker-time__dropdown-content">
                      <div class="picker-time__dropdown-option">
                        00
                      </div>
                    </div>
                </div>

                <button class="picker-time__dropdown-option">AM</button>
                <button  class="picker-time__dropdown-option">PM</button>

              </div>

            </div>

            <div class="picker__options-v">
              <button  class="picker__option-btn--center" type="button" name="button">
                  <div class="picker__option-btn--txt">
                    Aceptar
                  </div>
              </button>
            </div>

          </div>

          <hr></hr>

          <div class="picker__content">

            <div class="picker__section">

              <header class="picker__header ">
                  Selecciona día y hora
              </header>

              <div class="picker__row">

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div class="picker__row">

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div class="picker__row">

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div class="picker__row">

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div class="picker__row">

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div class="picker-time__selected">

                <div class="picker-time__dropdown">
                    <div class="picker-time__dropdown-trigger">
                      00
                    </div>
                    <div class="picker-time__dropdown-content">
                      <div class="picker-time__dropdown-option">
                        00
                      </div>
                    </div>
                </div>

                <span class="picker-time__points">:</span>

                <div class="picker-time__dropdown">
                    <div class="picker-time__dropdown-trigger">
                      00
                    </div>
                    <div class="picker-time__dropdown-content">
                      <div class="picker-time__dropdown-option">
                        00
                      </div>
                    </div>
                </div>

                <button class="picker-time__dropdown-option">AM</button>
                <button  class="picker-time__dropdown-option">PM</button>

              </div>

            </div>

              <div class="picker__options-v">
                <button  class="picker__option-btn--center" type="button" name="button">
                    <div class="picker__option-btn--txt">
                      Aceptar
                    </div>
                </button>
              </div>

            </div>

        </section>

        </div>
      </div>
  );

}

export default Repository;
