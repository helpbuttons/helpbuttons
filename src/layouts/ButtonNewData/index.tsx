//Data section of the button creation process , here is where butttonTemplate field of the backend displays all extradata, description, images and other specific field of the net you're displaying.
//It uses popup classNamees if it's an overlay. In mobile it's be its own page. It leads to buttonNewPublish and iis preceeded by ButtonNewType
//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import NavHeader from '../../components/NavHeader'
import NavBottom from '../../components/NavBottom'


export default function ButtonNewData() {

  return (

    <>
        <div className="popup__section">

          <p className="popup__paragraph">
            Añade un título diciendo qué buscas y/u ofreces con palabras clave. Añade
            imágenes si quieres.
          </p>

          <div className="form__input-tags"></div>

            <div className="button-new-description__exchange-container">

              <button type="button" name="button" >

              </button>

            </div>

          <textarea className="textarea__textarea"> </textarea>

            <div className="popup__options-v">
              <button className="btn">
                + Añadir imagen
              </button>
            </div>

            <div className="popup__options-h">

              <button className="popup__options-btn button-menu-white">
                + Añadir imagen
              </button>

                Cambiar imagen

              <img
                src=""
                alt="Avatar"
                className="popup__options-btn--icon"
              />

              <div className="popup__options-btn button-menu-white" type="button" name="button">
                Quitar imagen
              </div>

            </div>

        <div className="popup__options-v">

          <button
            className="popup__options-btn button-menu-white"
            type="button"
            name="button"
            disabled>
            Siguiente
          </button>

        </div>

      </div>

      <div className="button-new-description__spinner"> </div>

    </>


  );
}
