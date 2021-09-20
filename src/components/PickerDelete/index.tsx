///small popup to pick small data by the user
export default function PickerDelete() {
  return (
    <>
      <div class="picker">
          <header class="picker">
            <h5 class="ember-modal-dialog__title ember-modal-dialog__title--reservation-picker">
              ¿Seguro que quieres borrar este x?
              <small>
                ¡Esta acción no se puede deshacer!
                Todos los x serán eliminados y no volveran a ser accesibles.
              </small>
            </h5>
          </header>
          <button
            class=" card-chat__radius--left"
            type="button"
            name="button"
            {{action "showConfirmationDialog"}}
          >
            Cancelar
          </button>
          <div class="">
            <button
              class=" card-chat__radius--right"
              type="button"
              name="button"
            >
              Aceptar
            </button>
          </div>
      </div>
    </>
  );
}
