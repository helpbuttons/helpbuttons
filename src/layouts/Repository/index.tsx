//List of elements component that can be used anywhere in the app
import icon from '../../../public/assets/svg/icons/feed.svg'
import CrossIcon from '../../../public/assets/svg/icons/cross1'
import back from '../../../public/assets/svg/icons/back.svg'
import hand from '../../../public/assets/svg/icons/hand_call.svg'
import send from '../../../public/assets/svg/icons/send.svg'
import atta from '../../../public/assets/svg/icons/atta.svg'
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'
import BtnCircle from 'elements/BtnCircle'

function Repository() {
  return (
      <div className="repository">
        <div className="repository__content">
          <h1 className="repository__h1">
            List of elements, components and layouts.
          </h1>

          <h2 className="repository__h2">
            List of elements
          </h2>

          <h3 className="repository__title">
            Elements/btn :
          </h3>

          <section className="repository__section">

            <Btn iconLeft={IconType.red} caption="Necesito Btn" />
            
            <button className="btn-with-icon btn-with-icon--need">
              <div className="btn-filter__icon red"></div>
              <div className="btn-with-icon__text">
                Necesito
              </div>
            </button>

            <Btn iconLeft={IconType.green} caption="Ofrezco Btn" />
            <button className="btn-with-icon button-with-icon--offer">
              <div className="btn-filter__icon green"></div>
              <div className="btn-with-icon__text">
                Ofrezco
              </div>
            </button>

            <Btn iconLeft={IconType.green} caption="Ofrezco inactivo Btn" disabled={true} />
            <button disabled className="btn-with-icon button-with-icon--offer">
              <div className="btn-filter__icon green"></div>
              <div className="btn-with-icon__text">
                Ofrezco inactivo
              </div>
            </button>

            <hr></hr>

            <Btn iconLeft={IconType.splitRedGreen} caption="Intercambio Btn" />
            <button className="btn-with-icon">
              <div className="btn-filter__split-icon">
                <div className="btn-filter__split-icon--half green-l"></div>
                <div className="btn-filter__split-icon--half red-r"></div>
              </div>
              <div className="btn-with-icon__text">
                Intercambio
              </div>
            </button>

            <hr></hr>

            <Btn caption="Botón ejemplo sin icono" />

            <hr></hr>

            <Btn contentAlignment={ContentAlignment.center} caption="Botón ejemplo negro centrado Btn" />
            <button className="btn btn--black btn--center">
              Botón ejemplo negro centrado
            </button>

            <hr></hr>

            <Btn caption="Botón ejemplo corp"
                 contentAlignment={ContentAlignment.center}
                 btnType={BtnType.corporative} />

            <hr></hr>

            <Btn btnType={BtnType.filter} caption="Filter example Btn" />
            <button className="btn-filter">
              Filter example
            </button>

            <hr></hr>

            <Btn btnType={BtnType.filter} disabled={true} caption="Filter disabled example Btn" />
            <button disabled className="btn-filter">
              Filter disabled example
            </button>

            <hr></hr>

            <Btn btnType={BtnType.filter} iconLeft={IconType.splitRedGreen} caption="Filter with icon split Btn" />
            <button className="btn-filter-with-icon">
              <div className="btn-filter__split-icon">
                <div className="btn-filter__split-icon--half green-l"></div>
                <div className="btn-filter__split-icon--half red-r"></div>
              </div>
              Filter with icon split
            </button>

            <hr></hr>

            <Btn btnType={BtnType.filter} iconLeft={IconType.green} caption="Filter with icon green Btn" />
            <button className="btn-filter-with-icon">
              <div className="btn-filter__icon green"></div>
              Filter with icon green
            </button>

            <Btn btnType={BtnType.filter} iconLeft={IconType.green} iconRight={IconType.remove} caption="Filter with double icon Btn" />
            <button className="btn-filter-with-icon">
              <div className="btn-filter__icon green"></div>
              Filter with double icon
              <div className="btn-filter__remove-icon"></div>
            </button>

            <hr></hr>

            <div className="checkbox-filter__container">
              <label className="checkbox__filter-label">
                <input type="checkbox" className="checkbox-filter__checkbox" id="input-tos"></input>
                <div className="checkbox-filter__content btn-filter-with-icon">
                  <div className="btn-filter__icon red"></div>

                  <div className="checkbox__text">
                    Filter checkbox
                  </div>
                </div>
              </label>
            </div>

            <hr></hr>

            <BtnCircle />

            <BtnCircle disabled />

          </section>

          <h3 className="repository__title">
            elements/form
          </h3>
          <hr></hr>

          <section className="repository__section">

            <div className="form-field">
              <input type="text" className="form__input" placeholder="Placeholder"></input>
            </div>

            <hr></hr>

            <div className="form-field">
              <label className="form__label label">
                Text label
              </label>
              <input type="text" className="form__input" placeholder="Placeholder"></input>
            </div>

            <hr></hr>

            <div className="">
              <label className="form__label label">
                Text label
              </label>
              <input type="text" className="form__input--dark-bg" placeholder="Placeholder"></input>
              <div className="form__input-subtitle">
                <div className="form__input-subtitle-side">
                  <label className="form__input-subtitle--error">
                    Notes in this side to explain the field, also errors
                  </label>
                  <label className="form__input-subtitle--text">
                    Notes in this side to explain the field, also errors
                  </label>
                </div>
                <div className="form__input-subtitle-side">
                  <a href="" className="form__input-subtitle--text link">
                    Links to other extra functions on this side
                  </a>
                </div>
              </div>
            </div>

            <hr></hr>

            <div className="form__options-h">
              <div className="btn form__options-btn">
              CANCEL
              </div>
              <div className="btn form__options-btn">
                SAVE
              </div>
            </div>

            <hr></hr>

            <div className="form__options-h">

              <div className="form__options-text">
                Explain something
              </div>
              <div className="btn form__options-btn">
              CANCEL
              </div>

            </div>

            <hr></hr>

            <div className="form__options-v">
              <div className="btn form__options-btn">
              CANCEL
              </div>
              <div className="btn form__options-btn">
                SAVE
              </div>
            </div>

            <hr></hr>

          </section>

          <h3 className="repository__title">
            elements/textarea
          </h3>

          <section className="repository__section">

            <div className="textarea">
              <label className="form__label label">
                Text label
              </label>
              <textarea rows={4} cols={50} className="textarea__textarea" placeholder="Describe yourself here..."></textarea>
            </div>
          </section>

          <h3 className="repository__title">
            elements/dropdown
          </h3>
          <section className="repository__section">

            <div className="dropdown-select">
              <div className="label">label dropdown</div>
              <select className="dropdown-select__trigger">
                <option value="volvo" className="dropdown-select__option">Volvo</option>
                <option value="volvo" className="dropdown-select__option">Option1</option>
                <option value="volvo" className="dropdown-select__option">Option2</option>
                <option value="volvo" className="dropdown-select__option">Option3</option>
                <option value="volvo" className="dropdown-select__option">Option4</option>
                <option value="volvo" className="dropdown-select__option">Option5</option>
                <option value="volvo" className="dropdown-select__option">Option6</option>
              </select>
            </div>

            <hr></hr>

            <input className="dropdown-nets__dropdown-trigger dropdown__dropdown" autoComplete="off"  id="input" name="browsers" placeholder="Search Network" type='text' list='listid'></input>
            <datalist className="dropdown-nets__dropdown-content" id='listid'>
              <option className="dropdown-nets__dropdown-option" label='label1' value='Net1'>hola</option>
              <option className="dropdown-nets__dropdown-option" label='label2' value='Net2'>hola</option>
              <option className="dropdown-nets__create-new-button" label='label2' value='Net2'>Create Net</option>
            </datalist>

            <hr></hr>

            <input className="dropdown__dropdown" autoComplete="off" list="browsers" id="input" name="browsers" placeholder="Search Tag"></input>
              <datalist className="dropdown-nets__dropdown-content" id='browsers'>
                <option value="tag1" className="dropdown-nets__dropdown-option" label='label1'>tag</option>
                <option value="tag2" className="dropdown-nets__dropdown-option" label='label2'>Option1</option>
                <option value="tag3" className="dropdown-nets__dropdown-option" label='label3'>Option2</option>
                <option value="tag4" className="dropdown-nets__dropdown-option" label='label4'>Option3</option>
                <option value="tag5" className="dropdown-nets__dropdown-option" label='label5'>Option4</option>
                <option value="tag6" className="dropdown-nets__dropdown-option" label='label1'>Option5</option>
                <option value="tag7" className="dropdown-nets__dropdown-option" label='label1'>Option6</option>
              </datalist>

          </section>

          <h3 className="repository__title">
            elements/checkbox
          </h3>
          <section className="repository__section">

          <div className="label">label checkbox</div>
            <div className="checkbox">
              <label className="checkbox__label">
                <input type="checkbox" className="checkbox__checkbox" id="input-tos"></input>
                <div className="checkbox__content">
                  <div className="checkbox__icon">
                    <CrossIcon />
                  </div>
                  <div className="checkbox__text">
                    Ahora
                  </div>
                </div>
              </label>
            </div>

            <hr></hr>

            <div className="checkbox">
              <label className="checkbox__label">
                <input type="checkbox" className="checkbox__checkbox" id="input-tos"></input>
                <div className="checkbox__content">
                  <div className="checkbox__icon red"></div>
                  <div className="checkbox__text">
                    Necesito Ahora
                  </div>
                </div>
              </label>
            </div>

            <hr></hr>

            <div className="checkbox">
              <label className="checkbox__label">
                <input type="checkbox" className="checkbox__checkbox" id="input-tos"></input>
                <div className="checkbox__content">
                  <div className="checkbox__icon">
                    <CrossIcon />
                  </div>
                  <div className="checkbox__text">
                    Fecha/hora concreta
                  </div>
                </div>
              </label>
            </div>

            <hr></hr>

            <div className="checkbox">
              <label className="checkbox__label">
                <input type="checkbox" className="checkbox__checkbox" id="input-tos"></input>
                <div className="checkbox__content">
                  <div className="checkbox__icon">
                    <CrossIcon />
                  </div>
                  <div className="checkbox__text">
                    Cerca de mi
                  </div>
                </div>
              </label>
            </div>
          </section>

          <h3 className="repository__title">
            elements/text-style
          </h3>
          <section className="repository__section repository__section--yellow">
            <h1 className="title__h1">
              Reference site about Lorem Ipsum,  h1
            </h1>

            <hr></hr>

            <h1 className="title__h2">
              Reference site about Lorem Ipsum,  h2
            </h1>

            <hr></hr>

            <h1 className="title__h3">
              Reference site about Lorem Ipsum,  h3
            </h1>

            <hr></hr>

            <p className="paragraph">
              Lorem ipsum es el texto que se usa habitualmente en <a href="">diseño gráfico en demostraciones</a> de tipografías o de borradores de diseño para probar el diseño visual..
            </p>
          </section>

          <h3 className="repository__title">
            elements/hashtag
          </h3>
          <section className="repository__section">

            <a href="" className="hashtag hashtag--need">example</a>
            <a href="" className="hashtag hashtag--offer">example</a>
            <a href="" className="hashtag hashtag--yellow">example</a>
            <a href="" className="hashtag hashtag--yellow-home">example</a>
            <a href="" className="hashtag hashtag--white">example</a>
            <a href="" className="hashtag">example</a>

          </section>

          <h3 className="repository__title">
            elements/avatar
          </h3>
          <section className="repository__section">

            <div className="avatar-medium">
              <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" className="picture__img"></img>
            </div>

            <div className="avatar-big">
              <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" className="picture__img"></img>
            </div>

            <div className="avatar-small">
              <img src="https://dummyimage.com/30/#ccc/fff" alt="Avatar" className="picture__img"></img>
            </div>

          </section>

          <hr></hr>

          <h2 className="repository__h2">
            List of components
          </h2>

          <h3 className="repository__title">
            components/card-button-map
          </h3>
          <section className="repository__section repository__section--yellow">

            <div className="card-button-map card-button-map--need">
              <div className="card-button-map__content">

                <div className="card-button-map__header ">

                  <div className="card-button-map__info">

                    <div className="card-button-map__status card-button-map__status">

                          <span className="card-button-map__status--offer">button type</span> y <span className="card-button-map__status--need">button type</span>

                    </div>

                  </div>

                </div>

                <div className="card-button-map__hashtags">

                      <div className="card-button-map__busca">
                        <div className="hashtag">tag</div>
                      </div>

                </div>

                <div className="card-button-maps">

                  <div className="card-button-map__city card-button-map__everywhere " >
                    En todas partes
                  </div>

                  <div className="card-button-map__date">
                      Date
                  </div>

                </div>

              </div>

              <div className="card-button-map__picture-container">

                <div className="card-button-map__nav">

                  <div className="arrow btn-circle__icon">
                    <CrossIcon />
                  </div>
                  <div className="arrow btn-circle__icon">
                    <CrossIcon />
                  </div>

                </div>

                <img src="https://dummyimage.com/500x250/#ccc/fff" alt="button-picture" className="card-button-map__picture picture__img"></img>

              </div>

            </div>

          </section>

          <h3 className="repository__title">
            components/card-button-list
          </h3>

          <section className="repository__section repository__section--yellow">

          <div className="card-button-list card-button-list--need">

            <div className="card-button-list__picture-container">

              <div className="card-button-list__nav">

                <div className="arrow btn-circle__icon">
                  <CrossIcon />
                </div>
                <div className="arrow btn-circle__icon">
                  <CrossIcon />
                </div>

              </div>

              <img src="https://dummyimage.com/1000/#ccc/fff" alt="button-picture" className="picture__img"></img>

            </div>

            <div className="card-button-list__content">

              <div className="card-button-list__header">

                <div className="card-button-list__info">

                  <div className="card-button-list__status card-button-list__status">

                    <span className="card-button-list__status--offer">button type</span> y <span className="card-button-list__status--need">button type</span>

                  </div>

                  <div className="card-button-list__status card-button-list__status">

                    <span className="card-button-list__title">Button Name</span>

                  </div>

                </div>

                <div className="card-button-list__submenu card-button-list__trigger">
                </div>

              </div>

              <div className="card-button-list__hashtags">

                    <div className="card-button-list__busca">
                      <div className="hashtag">tag</div>
                    </div>

              </div>

              <div className="card-button-list__paragraph">

                <p>description</p>

                <p className="card-button-list__phone">phone</p>

              </div>

              <div className="card-button-lists">

                <div className="card-button-list__city card-button-list__everywhere " >
                  En todas partes
                </div>

                <div className="card-button-list__date">
                    Date
                </div>

              </div>

            </div>

          </div>

          </section>

          <h3 className="repository__title">
            components/popup-header
          </h3>

          <section className="repository__section repository__section--yellow">


            <div className="popup__header">
              <header className="popup__header-content">
                <div className="popup__header-left">
                  <button className="popup__header-button">
                    <div className="btn-circle__icon">
                      <CrossIcon />
                    </div>
                  </button>
                </div>
                <div className="popup__header-center">
                  <h1 className="popup__header-title">
                    Username
                  </h1>
                </div>
                <div className="popup__header-right">
                  <button className="popup__header-button">
                    <div className="btn-circle__icon">
                      <CrossIcon />
                    </div>
                  </button>
                </div>
              </header>
            </div>

          </section>

          <h3 className="repository__title">
            components/card-button
          </h3>

          <section className="repository__section repository__section--yellow">


            <div className="card-button card-button card-button--need">
              <div className="card-button__content">

               <div className="card-button__nets">

                       <img src='' alt="" className="card-avatar card-button__net-icon"></img>

               </div>

                <div className="card-button__header">

                  <div className="card-button__avatar">

                    <div className="avatar-big">
                      <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" className="picture__img"></img>
                    </div>

                  </div>

                  <div className="card-button__info">

                    <div className="card-button__status card-button__status">

                      <span className="card-button__status--offer">button type</span> y <span className="card-button__status--need">button type</span>

                    </div>

                    <div className="card-button__name">
                      Username
                    </div>

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

                <div className="card-buttons">

                  <div className="card-button__city card-button__everywhere " >
                    En todas partes
                  </div>

                  <div className="card-button__date">
                      Date
                  </div>

                </div>

              </div>

              <picture className="card-button__picture picture">

                <div className="card-button__picture-nav">

                  <div className="arrow btn-circle__icon">
                    <CrossIcon />
                  </div>
                  <div className="arrow btn-circle__icon">
                    <CrossIcon />
                  </div>

                </div>

                <img src="https://dummyimage.com/1000/#ccc/fff" alt="button-picture" className="card-button__picture picture__img"></img>

              </picture>

            </div>

            <div className="">

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

          </section>

          <hr></hr>

          <h3 className="repository__title">
            component/card-notification
          </h3>
          <section className="repository__section">

            <div className="card-notification card-notification--intercambio">
              <div className="card-notification__content">
                <div className="card-notification__avatar">

                  <div className="avatar-medium">
                    <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" className="picture__img"></img>
                  </div>

                  <div className="card-notification__icon">
                    <CrossIcon />
                  </div>
                </div>
                <div className="card-notification__text">
                  <div className="card-notification__header">
                    <div className="card-notification__info">
                      Comentario en #Amigos, #Tarde
                    </div>
                    <div className="card-notification__date">
                      hace 2 días
                    </div>
                  </div>
                  <h2 className="card-notification__title">
                    Jorge
                  </h2>
                  <div className="card-notification__paragraph">
                    Lorem ipsum es el texto que se usa en diseño gráfico en demostraciones...
                  </div>
                </div>
              </div>
            </div>

            <hr></hr>

            <div className="card-notification card-notification--offer">
              <div className="card-notification__content">
                <div className="card-notification__avatar">
                  <div className="avatar-medium">
                    <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" className="picture__img"></img>
                  </div>
                  <div className="card-notification__icon">
                    <CrossIcon />
                  </div>
                </div>
                <div className="card-notification__text">
                  <div className="card-notification__header">
                    <div className="card-notification__info">
                      Comentario en #Amigos, #Tarde
                    </div>
                    <div className="card-notification__date">
                      hace 2 días
                    </div>
                  </div>
                  <h2 className="card-notification__title">
                    Jorge
                  </h2>
                  <div className="card-notification__paragraph">
                    Lorem ipsum es el texto que se usa en diseño gráfico en demostraciones Lorem ipsum es el texto que se usa en diseño gráfico en demostraciones...
                  </div>
                </div>
              </div>
            </div>

            <hr></hr>

            <div className="card-notification card-notification--need">
              <div className="card-notification__content">
                <div className="card-notification__avatar">
                  <div className="avatar-medium">
                    <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" className="picture__img"></img>
                  </div>
                  <div className="card-notification__icon">
                    <CrossIcon />
                  </div>
                </div>
                <div className="card-notification__text">
                  <div className="card-notification__header">
                    <div className="card-notification__info">
                      Comentario en #Amigos, #Tarde
                    </div>
                    <div className="card-notification__date">
                      hace 2 días
                    </div>
                  </div>
                  <h2 className="card-notification__title">
                    Jorge
                  </h2>
                  <div className="card-notification__paragraph">
                    Lorem ipsum es el texto..
                  </div>
                </div>
              </div>
            </div>


        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/card-feed
        </h3>

        <section className="repository__section">

            <div className="card-notification">
              <div className="card-notification__content">
                <div className="card-notification__avatar">
                  <div className="avatar-medium">
                    <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" className="picture__img"></img>
                  </div>
                </div>
                <div className="card-notification__text">
                  <div className="card-notification__header">
                    <div className="card-notification__date card-notification__date--nflex">
                      hace 2 días
                    </div>
                  </div>
                  <h2 className="card-notification__title">
                    Jorge
                  </h2>
                  <div className="card-notification__paragraph">
                    Lorem ipsum es el texto..
                  </div>
                </div>
                <button className="btn-circle card-notification__delete">
                  <div className="btn-circle__content">
                    <div className="btn-circle__icon">
                      <CrossIcon />
                    </div>
                  </div>
                </button>
              </div>
            </div>


        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/card-profile
        </h3>

        <section className="repository__section">

          <div className="card-profile__container">
            <div className="card-profile__container-avatar-content">
              <figure className="card-profile__avatar-container avatar">
                <div className="avatar-big">
                  <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" className="picture__img"></img>
                </div>
              </figure>

              <div className="card-profile__content">
                <div className="card-profile__avatar-container-name">
                  Username
                </div>
                <figure className="card-profile__rating grid-three">

                  <div className="paragraph grid-three__column">
                    90
                    <div className="btn-circle__icon">
                      <CrossIcon />
                    </div>
                  </div>
                  <div className="paragraph grid-three__column">
                    77
                    <div className="btn-circle__icon">
                      <CrossIcon />
                    </div>
                  </div>
                  <div className="paragraph grid-three__column">
                    23
                    <div className="btn-circle__icon">
                      <CrossIcon />
                    </div>

                  </div>
                </figure>
            </div>
          </div>
          <div className="card-profile__data">
            <div className="card-profile__description grid-one__column-mid-element">
              Descripcion
            </div>

                <div className="card-profile__phone grid-one__column-mid-element">
                  09099190109091
                </div>
            <div className="card-profile__tags grid-one__column-mid-element">
              <div className="hashtag hashtag--yellow">tag</div>
            </div>
          </div>

          <div className="btn-with-icon">
            <div className="btn-with-icon__icon">
              <CrossIcon />
            </div>
            <span className="btn-with-icon__text">
              Cerrar sesión
            </span>
          </div>
        </div>
        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/popup-signup
        </h3>

        <section className="repository__section">

            <div className="popup">

              <div className="popup__header">
                <header className="popup__header-content">
                  <div className="popup__header-left">
                    <button className="popup__header-button">
                      <div className="btn-circle__icon">
                        <CrossIcon />
                      </div>
                    </button>
                  </div>
                  <div className="popup__header-center">
                    <h1 className="popup__header-title">
                      Signup
                    </h1>
                  </div>
                  <div className="popup__header-right">
                    <button className="popup__header-button">
                      <div className="btn-circle__icon">
                        <CrossIcon />
                      </div>
                    </button>
                  </div>
                </header>
              </div>

              <div className="popup__content">

                <div className="popup__img">
                  <img src="https://dummyimage.com/550x200/#ccc/fff" alt="Register_img" className=""></img>
                </div>

                <form className="popup__section" >

                  <div className="form-field">
                    <input type="text" className="form__input" placeholder="Escribe tu mail para participar"></input>
                  </div>

                  <button className="btn-with-icon button-with-icon--offer">
                    <div className="btn-filter__icon">
                      <CrossIcon />
                    </div>
                    <div className="btn-with-icon__text">
                      ENTRAR
                    </div>
                  </button>

                </form>

                <div className="popup__options-v">

                  <button className="popup__options-btn">Tengo cuenta</button>

                </div>

              </div>
            </div>
        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/popup-map
        </h3>

        <section className="repository__section">

            <div className="popup">
              <div className="popup__header">
                <header className="popup__header-content">
                  <div className="popup__header-left">
                    <button className="popup__header-button">
                      <div className="btn-circle__icon">
                        <CrossIcon />
                      </div>
                    </button>
                  </div>
                  <div className="popup__header-center">
                    <h1 className="popup__header-title">
                      Button location
                    </h1>
                  </div>
                  <div className="popup__header-right">
                    <button className="popup__header-button">
                      <div className="btn-circle__icon">
                        <CrossIcon />
                      </div>
                    </button>
                  </div>
                </header>
              </div>

              <div className="popup__content">


                <form className="popup__section" >

                    <input type="text" className="form__input" placeholder="Search location"></input>

                </form>

                <div className="popup__map">
                  <img src="https://dummyimage.com/550x200/#ccc/fff" alt="Map_select" className=""></img>
                </div>

                <div className="popup__options-h">

                  <button className="popup__options-btn">Cancelar</button>
                  <button className="popup__options-btn">Aceptar</button>

                </div>

              </div>
            </div>
        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/dropdown-nets
        </h3>

        <section className="repository__section">

          <input className="dropdown-nets__dropdown-trigger dropdown__dropdown" autoComplete="off" list="" id="input" name="browsers" placeholder="Select Network" type='text'></input>
          <datalist className="dropdown-nets__dropdown-content" id='listid'>
            <option className="dropdown-nets__dropdown-option" label='label1' value='Net1'>hola</option>
            <option className="dropdown-nets__dropdown-option" label='label2' value='Net2'>hola</option>
            <option className="dropdown-nets__create-new-button" label='label2' value='Net2'>Create Net</option>
          </datalist>

        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/error-message
        </h3>

        <section className="repository__section">

        <div className="error-message">

          <div className="error-message__icon">
            <CrossIcon />
          </div>
          <div className="">
            <p className="error-message__top-text">Error</p>
            <h4 className="error-message__title">
              Titulo error
            </h4>
            <p className="error-message__subtitle">
              Error mensaje
            </p>
          </div>

        </div>

        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/form-feed
        </h3>

        <section className="repository__section">

          <form className="feeds__new-message" >

              <button className="btn-circle">
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
              </button>
              <div className="feeds__new-message-message">
                <input className="form__input feeds__new-message-input"></input>
              </div>
              <button className="btn-circle">
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
              </button>

          </form>

        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/header-info-overlay
        </h3>

        <section className="repository__section">
            not defined as component
        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/header-search
        </h3>

        <section className="repository__section">

          <div className="header-search__tool">

            <form className="header-search__form">

              <div className="header-search__column">

                <div className="header-search__label">Qué</div>
                <input type="text" className="header-search--tags" placeholder='Selecciona fecha'></input>

              </div>

              <div className="header-search__column">

                  <div className="header-search__label">Dónde</div>
                  <input type="text" className="header-search--location" placeholder='Selecciona lugar'></input>

              </div>

              <div className="header-search__column">

                <div className="header-search__label">Cuándo</div>
                <input type="text" className="header-search--time" placeholder='Selecciona fecha'></input>

              </div>

            </form>

          </div>

        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/marker-button
        </h3>

        <section className="repository__section">

          <figure id='markerButton' className="marker-button marker-button--need">
            <div className="avatar-medium marker-button__image">
              <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" className="picture__img"></img>
            </div>
            <span className="marker-button__arrow"></span>
            <div className="marker-button__tags marker-button__tags--need">
                <div className="marker-button__link-tag">
                  tag
                </div>
            </div>

          </figure>

        </section>

        <hr></hr>

        <section className="repository__section">

          <figure id='markerButton' className="marker-button marker-button--need marker-button--name-alone">
            <span className="marker-button__arrow"></span>
            <div className="marker-button__tags--need">
                <div className="marker-button__link-tag--alone">
                  palabras
                </div>
            </div>

          </figure>

        </section>

        <hr></hr>


        <h3 className="repository__title">
          component/marker-net
        </h3>

        <section className="repository__section">

          <figure id='markerNet' className="marker-net">
            <div className="avatar-medium marker-net__image">
              <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" className="picture__img"></img>
            </div>
            <span className="marker-net__arrow"></span>
            <div className="marker-net__name">
                <div className="marker-net__link-name">
                  netname
                </div>
            </div>

          </figure>

        </section>

        <hr></hr>

        <section className="repository__section">

          <figure id='markerButton' className="marker-net marker-net--need marker-net--name-alone">
            <span className="marker-net__arrow"></span>
            <div className="marker-net__name">
                <div className="marker-net__link-name--alone">
                  netname
                </div>
            </div>

          </figure>

        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/message
        </h3>

        <section className="repository__section">

          <div className="message message--me">

            <div className="message__content">
              message
            </div>
            <div className="message__hour">
              00:00
            </div>

          </div>

          <hr></hr>

          <div className="message message--you">

            <div className="message__header">

                <div className="message__avatar">
                  <img src="https://dummyimage.com/30/#ccc/fff" alt="Avatar" className="avatar picture__img"></img>
                </div>

              <div className="message__user-name-container">
                <p className="message__user-name">Username</p>
              </div>

            </div>

            <div className="message__content">
              message
            </div>

            <div className="message__hour">
              00:00
            </div>

          </div>

          <hr></hr>

          <div className="message message--you">

            <div className="message__content">
              message
            </div>

            <div className="message__hour">
              00:00
            </div>

          </div>

        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/nav-bottom
        </h3>

        <section className="repository__section">

          <div id="bottom-nav" className="nav-bottom--repo">

            <a href="" className="nav-bottom__link nav-bottom__link--active">
                <div className="nav-bottom__icon">
                    <CrossIcon />
                </div>
                <div className="nav-bottom__text">
                  Map
                </div>
            </a>

            <a href="" className="nav-bottom__link nav-bottom__link--active">
                <div className="nav-bottom__icon">
                    <CrossIcon />
                </div>
                <div className="nav-bottom__text">
                  Create
                </div>
            </a>

            <a href="" className="nav-bottom__link nav-bottom__link--active">
                <div className="nav-bottom__icon">
                    <CrossIcon />
                </div>
                <div className="nav-bottom__text">
                  Login
                </div>
            </a>

            <a href="" className="nav-bottom__link nav-bottom__link--active">
                <div className="nav-bottom__icon">
                    <CrossIcon />
                </div>
                <div className="nav-bottom__text">
                  Faqs
                </div>
            </a>

          </div>

        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/nav-header
        </h3>

        <section className="repository__section">

          <form className="nav-header__content" >

              <button className="btn-circle">
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
              </button>

              <div className="nav-header__content-message">
                <input className="form__input nav-header__content-input" placeholder="Search tags"></input>
              </div>

              <button className="btn-circle">
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </div>
              </button>

          </form>

        </section>

        <hr></hr>


        <h3 className="repository__title">
          component/filters
        </h3>

        <section className="repository__section">

          <div className="filters">

              <div className="checkbox-filter__container">
                <label className="checkbox__filter-label">
                  <input type="checkbox" className="checkbox-filter__checkbox" id="input-tos"></input>
                  <div className="checkbox-filter__content btn-filter-with-icon">
                    <div className="btn-filter__icon red"></div>

                    <div className="checkbox__text">
                      Necesitan
                    </div>
                  </div>
                </label>
              </div>

              <div className="checkbox-filter__container">
                <label className="checkbox__filter-label">
                  <input type="checkbox" className="checkbox-filter__checkbox" id="input-tos"></input>
                  <div className="checkbox-filter__content btn-filter-with-icon">
                    <div className="btn-filter__icon red"></div>

                    <div className="checkbox__text">
                      Necesitan
                    </div>
                  </div>
                </label>
              </div>

              <select className="dropdown__filter">
                <option value="volvo" className="dropdown-select__option">Volvo</option>
                <option value="volvo" className="dropdown-select__option">Option1</option>
                <option value="volvo" className="dropdown-select__option">Option2</option>
                <option value="volvo" className="dropdown-select__option">Option3</option>
                <option value="volvo" className="dropdown-select__option">Option4</option>
                <option value="volvo" className="dropdown-select__option">Option5</option>
                <option value="volvo" className="dropdown-select__option">Option6</option>
              </select>

          </div>

          </section>



        <h3 className="repository__title">
          component/overlay-loading
        </h3>

        <section className="repository__section">

        <div className="spinner-overlay">
          <figure className="btn-circle">
            <div className="loading-overlay__loading-icon spinner">
              <CrossIcon />
            </div>
          </figure>
        </div>

        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/picker
        </h3>

        <section className="repository__section">

          <div className="picker">
            <div className="picker--over picker-box-shadow picker__content picker__options-v">
              <button  className="picker__option-btn--active" type="button" name="button">
                  <div className="picker__option-btn--icon">
                    <CrossIcon />
                  </div>
                  <div className="picker__option-btn--txt">
                    Ahora
                  </div>
              </button>
              <button  className="picker__option-btn--active" type="button" name="button">
                  <div className="picker__option-btn--icon">
                    <CrossIcon />
                  </div>
                  <div className="picker__option-btn--txt">
                    Fecha / hora concreta
                  </div>
              </button>
              <button  className="picker__option-btn-with-icon" type="button" name="button">
                  <div className="picker__option-btn--icon">
                    <CrossIcon />
                  </div>
                  <div className="picker__option-btn--txt">
                    Fecha / hora concreta
                  </div>
              </button>
            </div>
          </div>

        </section>

        <hr></hr>

        <h3 className="repository__title">
          component/picker-time
        </h3>

        <section className="repository__section">

          <div className="picker__content">
            <div className="picker__section">
              <header className="picker__header ">
                  Selecciona días de la semana y hora
              </header>
              <div className="picker__row">

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div className="picker-time__selected">

                <div className="picker-time__dropdown">
                    <div className="picker-time__dropdown-trigger">
                      00
                    </div>
                    <div className="picker-time__dropdown-content">
                      <div className="picker-time__dropdown-option">
                        00
                      </div>
                    </div>
                </div>

                <span className="picker-time__points">:</span>

                <div className="picker-time__dropdown">
                    <div className="picker-time__dropdown-trigger">
                      00
                    </div>
                    <div className="picker-time__dropdown-content">
                      <div className="picker-time__dropdown-option">
                        00
                      </div>
                    </div>
                </div>

                <button className="picker-time__dropdown-option">AM</button>
                <button  className="picker-time__dropdown-option">PM</button>

              </div>

            </div>

            <div className="picker__options-v">
              <button  className="picker__option-btn--center" type="button" name="button">
                  <div className="picker__option-btn--txt">
                    Aceptar
                  </div>
              </button>
            </div>

          </div>

          <hr></hr>

          <div className="picker__content">

            <div className="picker__section">

              <header className="picker__header ">
                  Selecciona día y hora
              </header>

              <div className="picker__row">

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div className="picker__row">

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div className="picker__row">

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div className="picker__row">

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div className="picker__row">

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        Lun
                      </div>
                    </div>
                  </button>

              </div>

              <div className="picker-time__selected">

                <div className="picker-time__dropdown">
                    <div className="picker-time__dropdown-trigger">
                      00
                    </div>
                    <div className="picker-time__dropdown-content">
                      <div className="picker-time__dropdown-option">
                        00
                      </div>
                    </div>
                </div>

                <span className="picker-time__points">:</span>

                <div className="picker-time__dropdown">
                    <div className="picker-time__dropdown-trigger">
                      00
                    </div>
                    <div className="picker-time__dropdown-content">
                      <div className="picker-time__dropdown-option">
                        00
                      </div>
                    </div>
                </div>

                <button className="picker-time__dropdown-option">AM</button>
                <button  className="picker-time__dropdown-option">PM</button>

              </div>

            </div>

              <div className="picker__options-v">
                <button  className="picker__option-btn--center" type="button" name="button">
                    <div className="picker__option-btn--txt">
                      Aceptar
                    </div>
                </button>
              </div>

            </div>

        </section>

      <hr></hr>

      <h3 className="repository__title">
        component/accordion
      </h3>

      <section className="repository__section">

      <button className="accordion">Section 1</button>
        <div className="panel">
        <p>Lorem ipsum... palabra. Ejemplo palabras Ejemplo palabras Ejemplo palabras Ejemplo palabras Ejemplo palabras Ejemplo palabras. Ejemplo palabras Ejemplo palabras Ejemplo palabras ., Ejemplo palabrasEjemplo palabras</p>
        </div>

      <button className="accordion">Section 2</button>
        <div className="panel">
        <p>Lorem ipsum...</p>
        </div>

      <button className="accordion">Section 3</button>
        <div className="panel">
        <p>Lorem ipsum...</p>
        </div>

      </section>

      <hr></hr>

      </div>

    </div>

  );

}

export default Repository;
