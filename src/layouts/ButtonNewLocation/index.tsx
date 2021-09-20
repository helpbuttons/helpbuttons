//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network

export default function ButtonNewLocation() {

  return (

    <>
    <div classNameName="btn-new-activate__colums">

        En cualquier lugar
      <div className="btn">
        Cambiar lugar
      </div>

    </div>

    <div className="picker--over picker-box-shadow picker__content picker__options-v">
      <button  className="picker__option-btn--active" type="button" name="btn">
          <div className="picker__option-btn--icon">
          </div>
          <div className="picker__option-btn--txt">
            En cualquier lugar
          </div>
      </button>
      <button  className="picker__option-btn--active" type="button" name="button">
          <div className="picker__option-btn--icon">
          </div>
          <div className="picker__option-btn--txt">
            En un sitio concreto
          </div>
      </button>
      <button  className="picker__option-btn--active" type="button" name="button">
          <div className="picker__option-btn--icon">
          </div>
          <div className="picker__option-btn--txt">
            Desde / Hasta
          </div>
      </button>
    </div>

    </>


  );
}
