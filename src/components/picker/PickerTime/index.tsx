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
        {/* TODO: check how to deal with actions */}
        <button className="picker__options-btn button-menu-white" data-action='confirmDate' type="button" name="button">
          Aceptar
        </button>
        <button className="picker__options-btn button-menu-white" data-action='cleanDate' type="button" name="button">
          Limpiar
        </button>

      </div>

    </div>

  );
}
