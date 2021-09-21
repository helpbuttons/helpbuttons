///mobile home info overlay with network descripttion, andd dropddown for networks selection
export default function HeaderInfoOverlay() {
  return (

    <div className="info-overlay__container">

        <div className="form-field">
          <label className="form__label label">
            Origen de tu viaje :
          </label>
          <input type="text" className="form__input" placeholder="Search Location"></input>
          <label className="form__label label">
            Destino :
          </label>
          <input type="text" className="form__input" placeholder="Search Location"></input>
        </div>

        <div className="form-field">
          <label className="form__label label">
            Cuándo viajas :
          </label>
          <button className="btn-with-icon">
            <div className="btn-filter__split-icon">
              <div className="btn-filter__split-icon--half green-l"></div>
              <div className="btn-filter__split-icon--half red-r"></div>
            </div>
            <div className="btn-with-icon__text">
              Seleccionar fechas
            </div>
          </button>
        </div>

        <hr></hr>

        <div className="form-field">
          <label className="form__label label">
            Tipos de botón
          </label>

          <div className="form__options-h">
            <div className="checkbox">
              <label className="checkbox__label">
                <input type="checkbox" className="checkbox__checkbox" id="input-tos"></input>
                <div className="checkbox__content form__options-btn">
                  <div className="checkbox__icon red"></div>
                  <div className="checkbox__text">
                    Necesito Ahora
                  </div>
                </div>
              </label>
            </div>
            <div className="checkbox">
              <label className="checkbox__label">
                <input type="checkbox" className="checkbox__checkbox" id="input-tos"></input>
                <div className="checkbox__content form__options-btn">
                  <div className="checkbox__icon red"></div>
                  <div className="checkbox__text">
                    Necesito Ahora
                  </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        <div className="form-field">
          <label className="form__label label">
            Text label
          </label>
          <select className="dropdown__dropdown">
            <option value="volvo" className="dropdown-select__option">Volvo</option>
            <option value="volvo" className="dropdown-select__option">Option1</option>
            <option value="volvo" className="dropdown-select__option">Option2</option>
            <option value="volvo" className="dropdown-select__option">Option3</option>
            <option value="volvo" className="dropdown-select__option">Option4</option>
            <option value="volvo" className="dropdown-select__option">Option5</option>
            <option value="volvo" className="dropdown-select__option">Option6</option>
          </select>
        </div>

    </div>

  );
}
