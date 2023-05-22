import t from "i18n";
import DropDownSearchLocation from "elements/DropDownSearchLocation";

//Mobile filters section that includes not only the filters but some search input fields, maybe needed to make a separate component from the rest of esktop elements
export default function AdvancedFilters() {
  return (

  <form className="filters--vertical">

      <div className="form__field">
        <label className="form__label label">
          ¿Qué buscas?
        </label>
        <input type="text" className="form__input" placeholder="Search whatever you want"></input>
      </div>

      <div className="form__field">
        <label className="form__label label">
          Tipos de botón
        </label>
        <button className="btn-with-icon">
          <div className="btn-filter__split-icon">
            <div className="btn-filter__split-icon--half green-l"></div>
            <div className="btn-filter__split-icon--half red-r"></div>
          </div>
          <div className="btn-with-icon__text">
            Need
          </div>
        </button>
        <button className="btn-with-icon">
          <div className="btn-filter__split-icon">
            <div className="btn-filter__split-icon--half green-l"></div>
            <div className="btn-filter__split-icon--half red-r"></div>
          </div>
          <div className="btn-with-icon__text">
            Offer
          </div>
        </button>
        <button className="btn-with-icon">
          <div className="btn-filter__split-icon">
            <div className="btn-filter__split-icon--half green-l"></div>
            <div className="btn-filter__split-icon--half red-r"></div>
          </div>
          <div className="btn-with-icon__text">
            Service
          </div>
        </button>
      </div>

      <div className="form__field">
        <label className="form__label label">
          ¿Dónde buscas?
        </label>
        <input type="text" className="form__input" placeholder="Search Location"></input>
        <DropDownSearchLocation
          placeholder={t('homeinfo.searchlocation')}
          // handleSelectedPlace={handleSelectedPlace}
        />
      </div>

      <div className="form__field">
        <label className="form__label label">
          Distancia de búsqueda
        </label>
        <select className="dropdown__dropdown">
          <option value="status" className="dropdown-select__option">10km</option>
          <option value="status" className="dropdown-select__option">100km</option>
          <option value="status" className="dropdown-select__option">200km</option>
          <option value="status" className="dropdown-select__option">300km</option>
        </select>
      </div>

      <hr></hr>

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
