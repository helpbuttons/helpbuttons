//a variation of picker specific for time
export default function PickerTime() {
  return (

    <div className="picker__content picker-box-shadow">

      <div className="picker__section">

        <header className="picker__header">
          <label>Mostrar botones con fecha a partir de:</label>
        </header>

      </div>

      <div className="picker__options-h">

        <button className="picker__options-btn button-menu-white" {{action 'confirmDate'}} type="button" name="button">
          Aceptar
        </button>
        <button className="picker__options-btn button-menu-white" {{action 'cleanDate'}} type="button" name="button">
          Limpiar
        </button>

      </div>

    </div>

  );
}
