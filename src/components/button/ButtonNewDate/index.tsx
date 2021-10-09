//is the component or element integrated in buttonNewPublish. Right before activate button. It displays the current selected date and a button to chang it, that ddisplays a picker with the date options for the net that's selecte

export default function ButtonNewDate({ exact, ...props }) {

  return (

    <>
    <div className="btn-new-activate__colums">


      <div className="card-buttons">

        <div className="card-button__date">
            {props.date}
        </div>

      </div>

      <div className="btn">
        Cambiar fecha
      </div>

    </div>

    <div className="picker--over picker-box-shadow picker__content picker__options-v">
      <button  className="picker__option-btn--active" type="button" name="btn">
          <div className="picker__option-btn--icon">
          </div>
          <div onClick={() => props.setDate("Ahora")} className="picker__option-btn--txt">
            Ahora
          </div>
      </button>
      <button onClick={() => props.setDate("10 Abril de 2022")}  className="picker__option-btn--active" type="button" name="button">
          <div className="picker__option-btn--icon">
          </div>
          <div className="picker__option-btn--txt">
            En una fecha Concreta
          </div>
      </button>
      <button onClick={() => props.setDate("Todos los miércoles")}  className="picker__option-btn--active" type="button" name="button">
          <div className="picker__option-btn--icon">
          </div>
          <div className="picker__option-btn--txt">
            Fecha periódica
          </div>
      </button>
    </div>

    </>


  );
}
