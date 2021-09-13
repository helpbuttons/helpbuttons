//a variation of picker specific for time
export default function PickerTime() {
  return (

    <div class="picker__content picker-box-shadow">

      <div class="picker__section">

        <header class="picker__header">
          <label>Mostrar botones con fecha a partir de:</label>
        </header>

      </div>

      <div class="picker__options-h">

        <button class="picker__options-btn button-menu-white" {{action 'confirmDate'}} type="button" name="button">
          Aceptar
        </button>
        <button class="picker__options-btn button-menu-white" {{action 'cleanDate'}} type="button" name="button">
          Limpiar
        </button>

      </div>

    </div>

  );
}
