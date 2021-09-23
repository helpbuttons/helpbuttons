//This is the first section in the button creation process, but can be displayed or not depending on the selected network settings. It displays the buttons types (default offer an need and exchange) and leads to ButtonNewData after selection


export default function ButtonNewType() {

  return (

    <>

      <div className="popup__section">
        <p className="popup__paragraph">
          ? Qué quieres hacer ? :
        </p>
        <button className="btn-with-icon btn-with-icon--hover btn-with-icon--offer">
          <div className="btn-filter__icon green"></div>
          <div className="btn-with-icon__text">
            Ofrezco
          </div>
        </button>

        <button className=" btn-with-icon btn-with-icon--hover btn-with-icon--intercambia">
          <div className="btn-filter__split-icon">
            <div className="btn-filter__split-icon--half green-l"></div>
            <div className="btn-filter__split-icon--half red-r"></div>
          </div>
          <div className="btn-with-icon__text">
            Intercambio
          </div>
        </button>

        <button className=" btn-with-icon btn-with-icon--hover btn-with-icon--need">
          <div className="btn-filter__icon red"></div>
          <div className="btn-with-icon__text">
            Necesito
          </div>
        </button>
      </div>


    </>


  );
}
