//Data section of the button creation process , here is where butttonTemplate field of the backend displays all extradata, description, images and other specific field of the net you're displaying.
//It uses popup classNamees if it's an overlay. In mobile it's be its own page. It leads to buttonNewPublish and iis preceeded by ButtonNewType
//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share


export default function ButtonNewData({ exact, ...props }) {

  return (

    <>

        <div className="popup__section">

          <p className="popup__paragraph">
            Añade un título diciendo qué buscas y/u ofreces. Añade
            imágenes si quieres.
          </p>

          <textarea onChange={() => props.setDescription("")} name="description" className="textarea__textarea" placeholder="Escribe aquí tu descripción"></textarea>
          <div className="invalid-feedback">{props.errors.description?.message}</div>

          <p className="popup__paragraph">
            Elige etiquetas que definan tu botón :
          </p>

          <div className="card-button__hashtags">

              <div className="card-button__busca">
                <div onClick={() => props.setTags("tag1")} className="hashtag">tag</div>
              </div>

          </div>

          <div className="popup__options-h">

              <label htmlFor="files" className="btn">
                + Añadir imagen
              </label>
              <input id="files" type="file" className="btn"/>

          </div>


      </div>

      <div className="button-new-description__spinner"> </div>

    </>


  );
}
