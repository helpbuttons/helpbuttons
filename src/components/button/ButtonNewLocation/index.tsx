//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network

export default function ButtonNewLocation({ exact, ...props }) {

  return (

    <>

    <div className="btn-new-activate__colums">

      <div className="card-buttons">

        <div className="card-button__city card-button__everywhere " >
          En todas partes
        </div>

      </div>

      <div className="btn">
          Cambiar lugar
      </div>

    </div>

    <div className="picker--over picker-box-shadow picker__content picker__options-v">
      <div onClick={() => props.setLoc("En todas partes")}  className="picker__option-btn--active" type="button" name="btn">
          <div className="picker__option-btn--icon">
          </div>
          <div className="picker__option-btn--txt">
            En cualquier lugar
          </div>
      </div>
      <div onClick={() => props.setLoc("Calle Ancha 24, Jerez")}  className="picker__option-btn--active" type="button" name="button">
          <div className="picker__option-btn--icon">
          </div>
          <div className="picker__option-btn--txt">
            En un sitio concreto
          </div>
      </div>
      <div onClick={() => props.setLoc("De Calle Larga 24, Madrid a Calle ancha 22, Jerez")}  className="picker__option-btn--active" type="button" name="button">
          <div className="picker__option-btn--icon">
          </div>
          <div className="picker__option-btn--txt">
            Desde / Hasta
          </div>
      </div>
    </div>

    </>


  );
}
