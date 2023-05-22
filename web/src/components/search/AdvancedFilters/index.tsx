import t from "i18n";
import DropDownSearchLocation from "elements/DropDownSearchLocation";

//Mobile filters section that includes not only the filters but some search input fields, maybe needed to make a separate component from the rest of esktop elements
export default function AdvancedFilters() {
  return (

  <form className="filters--vertical">

      <div className="form__field">
                      <DropDownSearchLocation
                        placeholder={t('homeinfo.searchlocation')}
                        // handleSelectedPlace={handleSelectedPlace}
                      />

        <label className="form__label label">
          Origen de tu viaje :
        </label>
        <input type="text" className="form__input" placeholder="Search Location"></input>
        <label className="form__label label">
          Destino :
        </label>
        <input type="text" className="form__input" placeholder="Search Location"></input>
      </div>

      <div className="form__field">
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


      <div className="form__field">
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

      <div className="form__field">
        <label className="form__label label">
          Text label
        </label>
        <select className="dropdown__dropdown">
          <option value="status" className="dropdown-select__option">Status changes</option>
          <option value="status" className="dropdown-select__option">All comments</option>
          <option value="status" className="dropdown-select__option">Other users comments</option>
          <option value="status" className="dropdown-select__option">Telegram messages</option>
          <option value="status" className="dropdown-select__option">All interactions</option>
          <option value="status" className="dropdown-select__option">Other buttons interactions</option>
          <option value="status" className="dropdown-select__option">My buttons interactions</option>
        </select>
      </div>

  </form>

);
}
