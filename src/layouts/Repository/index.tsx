//List of elements component that can be used anywhere in the app
function Repository() {
  return (
      <div class="repository">
        <div class="repository__content">
          <h1 class="repository__h1">
            List of atoms, components and compositons.
          </h1>

          <h2 class="repository__h2">
            List of atoms
          </h2>

          <h3 class="repository__title">
            atoms/button
          </h3>

          <section class="repository__section">
            <button class="btn">
              Hola
            </button>

            <hr></hr>

            <button class="btn-gray">
              Hola
            </button>

            <hr></hr>

            <button class="btn-with-icon btn-with-icon--offer">
              <div class="btn-with-icon__icon">
                i
              </div>
              <div class="btn-with-icon__text">
                Ofrezco
              </div>
            </button>

            <hr></hr>

            <button class="btn-with-icon btn-with-icon--intercambia">
              <div class="btn-with-icon__icon">
                i
              </div>
              <div class="btn-with-icon__text">
                Intercambio
              </div>
            </button>

            <hr></hr>

            <button class="btn-with-icon btn-with-icon--need">
              <div class="btn-with-icon__icon">
                i
              </div>
              <div class="btn-with-icon__text">
                Necesito
              </div>
            </button>

            <hr></hr>

            <button class="btn">
              Hola
            </button>

            <hr></hr>

            <button class="btn-circle">
              <div class="btn-circle__content">
                <div class="btn-circle__number">
                  4
                </div>
                <div class="btn-circle__icon">
                  c
                </div>
              </div>
            </button>

            <hr></hr>

            <button class="btn-circle">
              <div class="btn-circle__content">
                <div class="btn-circle__icon">
                  c
                </div>
              </div>
            </button>
          </section>

          <h3 class="repository__title">
            atoms/input
          </h3>
          <section class="repository__section">
            <div class="form__input">
              <input type="text" class="input__input" placeholder="Placeholder"></input>
            </div>

            <hr></hr>

            <div class="input">
              <label class="label">
                Text label
              </label>
              <input type="text" class="input__input" placeholder="Placeholder"></input>
            </div>
          </section>

          <h3 class="repository__title">
            atoms/textarea
          </h3>
          <section class="repository__section">
            <div class="textarea">
              label
              <textarea rows="4" cols="50" class="textarea__textarea" placeholder="Describe yourself here..."></textarea>
            </div>
          </section>

          <h3 class="repository__title">
            atoms/select
          </h3>
          <section class="repository__section">
            <div class="select">
              <select class="select__select">
                <option value="volvo" class="select">Volvo</option>
                <option value="volvo" class="">Option1</option>
                <option value="volvo" class="">Option2</option>
                <option value="volvo" class="">Option3</option>
                <option value="volvo" class="">Option4</option>
                <option value="volvo" class="">Option5</option>
                <option value="volvo" class="">Option6</option>
              </select>
            </div>

            <hr></hr>

            <div class="select">
              label
              <select class="select__select">
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
            atoms/checkbox
          </h3>
          <section class="repository__section">
            <div class="checkbox">
              <label class="checkbox__label">
                <input type="checkbox" class="checkbox__checkbox" id="input-tos"></input>
                <div class="checkbox__content">
                  <div class="checkbox__icon">
                    icon
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
                    icon
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
                    icon
                  </div>
                  <div class="checkbox__text">
                    Cerca de mi
                  </div>
                </div>
              </label>
            </div>
          </section>

          <h3 class="repository__title">
            atoms/text-style
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
            atoms/hashtag
          </h3>
          <section class="repository__section">
            <a href="" class="hashtag">example</a>
          </section>

          <h3 class="repository__title">
            atoms/avatar
          </h3>
          <section class="repository__section">
            <picture class="picture">
              <img src="https://dummyimage.com/80/#ccc/fff" alt="Avatar" class="avatar picture__img"></img>
            </picture>
          </section>

          <h2 class="repository__h2">
            List of components
          </h2>

          <h3 class="repository__title">
            component/buttons
          </h3>
          <section class="repository__section repository__section--yellow">

          </section>

          <h3 class="repository__title">
            component/header
          </h3>
          <section class="repository__section">
            <header class="header">
              <div class="header__nav">
                <a href="" class="header__icon">
                  menu icon
                </a>
              </div>
              <div class="header__center">
                <h1 class="header__title">
                  Title of page
                </h1>
              </div>
              <div class="header__nav">
                <a href="" class="header__icon">
                  icon
                </a>
              </div>
            </header>

            <hr></hr>

            <header class="header header--black">
              <div class="header__nav">
                <a href="" class="header__icon">
                  icon
                </a>
              </div>
              <div class="header__center">
                i
              </div>
              <div class="header__nav">
                <a href="" class="header__icon">
                  i
                </a>
              </div>
            </header>

            <hr></hr>

            <header class="header header--white">
              <div class="header__nav">
                <a href="" class="header__icon">
                </a>
              </div>
              <div class="header__center">
                <h1 class="header__title">
                  Title of page
                </h1>
              </div>
              <div class="header__nav">
                <a href="" class="header__icon">
                  x
                </a>
              </div>
            </header>
          </section>

          <h3 class="repository__title">
            component/card-button
          </h3>
          <section class="repository__section">

          </section>

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
                    icon
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
                    icon
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
                    icon
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


            <hr></hr>

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
                    x
                  </a>
                </div>
              </div>
            </div>
          </section>


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
