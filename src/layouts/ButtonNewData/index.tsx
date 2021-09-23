//Data section of the button creation process , here is where butttonTemplate field of the backend displays all extradata, description, images and other specific field of the net you're displaying.
//It uses popup classNamees if it's an overlay. In mobile it's be its own page. It leads to buttonNewPublish and iis preceeded by ButtonNewType
//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import PopupHeader from '../../components/PopupHeader'


export default function ButtonNewData() {

  return (

    <>

        <div className="popup__section">

          <p className="popup__paragraph">
            Añade un título diciendo qué buscas y/u ofreces. Añade
            imágenes si quieres.
          </p>

          <textarea className="textarea__textarea" placeholder="Escribe aquí tu descripción"></textarea>

          <p className="popup__paragraph">
            Elige etiquetas que definan tu botón :
          </p>

          <div className="card-button__hashtags">

                <div className="card-button__busca">
                  <div className="hashtag">tag</div>
                </div>

          </div>

          <div className="popup__options-h">

            <button className="btn">
              + Añadir imagen
            </button>

          </div>

          <div className="popup__options-v">

            <button
              className="btn"
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
