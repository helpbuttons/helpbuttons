//This is the first section in the button creation process, but can be displayed or not depending on the selected network settings. It displays the buttons types (default offer an need and exchange) and leads to ButtonNewData after selection


export default function ButtonNewType() {

  return (

    <>

      <div class="popup__section">
        <p class="popup__paragraph">
          Un botón es un perfil público que te permitirá encontrar personas que
          puedan necesitar o puedan ofrecerte colaboración.
        </p>
        <button class="button-with-icon button-with-icon--hover button-with-icon--offer">
          <div class="button-filter__icon green"></div>
          <div class="button-with-icon__text">
            Ofrezco
          </div>
        </button>

        <button class=" button-with-icon button-with-icon--hover button-with-icon--intercambia">
          <div class="button-filter__split-icon">
            <div class="button-filter__split-icon--half green-l"></div>
            <div class="button-filter__split-icon--half red-r"></div>
          </div>
          <div class="button-with-icon__text">
            Intercambio
          </div>
        </button>

        <button class=" button-with-icon button-with-icon--hover button-with-icon--need">
          <div class="button-filter__icon red"></div>
          <div class="button-with-icon__text">
            Necesito
          </div>
        </button>
      </div>


    </>


  );
}
