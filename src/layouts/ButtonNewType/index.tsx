//This is the first section in the button creation process, but can be displayed or not depending on the selected network settings. It displays the buttons types (default offer an need and exchange) and leads to ButtonNewData after selection


export default function ButtonNewType() {

  return (

    <>

      <div className="popup__section">
        <p className="popup__paragraph">
          Un botón es un perfil público que te permitirá encontrar personas que
          puedan necesitar o puedan ofrecerte colaboración.
        </p>
        <button className="button-with-icon button-with-icon--hover button-with-icon--offer">
          <div className="button-filter__icon green"></div>
          <div className="button-with-icon__text">
            Ofrezco
          </div>
        </button>

        <button className=" button-with-icon button-with-icon--hover button-with-icon--intercambia">
          <div className="button-filter__split-icon">
            <div className="button-filter__split-icon--half green-l"></div>
            <div className="button-filter__split-icon--half red-r"></div>
          </div>
          <div className="button-with-icon__text">
            Intercambio
          </div>
        </button>

        <button className=" button-with-icon button-with-icon--hover button-with-icon--need">
          <div className="button-filter__icon red"></div>
          <div className="button-with-icon__text">
            Necesito
          </div>
        </button>
      </div>


    </>


  );
}
