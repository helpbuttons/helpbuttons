//is the component or element integrated in buttonNewPublish. Right before activate button. It displays the current selected date and a button to chang it, that ddisplays a picker with the date options for the net that's selecte
import NavHeader from '../../components/NavHeader'
import NavBottom from '../../components/NavBottom'


export default function ButtonNewDate() {

  return (

    <>
    <div class="btn-new-activate__colums">

        Ahora
      <div class="btn">
        Cambiar fecha
      </div>

    </div>

    <div class="picker--over picker-box-shadow picker__content picker__options-v">
      <button  class="picker__option-btn--active" type="button" name="btn">
          <div class="picker__option-btn--icon">
          </div>
          <div class="picker__option-btn--txt">
            Ahora
          </div>
      </button>
      <button  class="picker__option-btn--active" type="button" name="button">
          <div class="picker__option-btn--icon">
          </div>
          <div class="picker__option-btn--txt">
            Ahora
          </div>
      </button>
      <button  class="picker__option-btn--active" type="button" name="button">
          <div class="picker__option-btn--icon">
          </div>
          <div class="picker__option-btn--txt">
            Ahora
          </div>
      </button>
    </div>

    </>


  );
}
