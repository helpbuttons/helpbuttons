///small popup to pick small data by the user
export default function PickerDelete() {
  return (
    <>
      <div className="picker">
          <header className="picker">
            <h5 className="ember-modal-dialog__title ember-modal-dialog__title--reservation-picker">
              ¿Seguro que quieres borrar este x?
              <small>
                ¡Esta acción no se puede deshacer!
                Todos los x serán eliminados y no volveran a ser accesibles.
              </small>
            </h5>
          </header>
          {/* XXX: check what to do with this action */}
          <button
            className=" card-feed__radius--left"
            type="button"
            name="button"
            data-action="showConfirmationDialog"
          >
            Cancelar
          </button>
          <div className="">
            <button
              className=" card-feed__radius--right"
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
