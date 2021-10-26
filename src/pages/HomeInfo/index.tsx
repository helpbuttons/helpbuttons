//INFO AND RESULTS
import NavHeader from '../../components/nav/NavHeader'

import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'

export default function Faqs() {

  return (

    <>

      <div className="info-overlay__container">

        <div className="info-overlay__content">

          <div className="info-overlay__name">
            Net Name
          </div>

          <div className="info-overlay__description">
            Net description
          </div>

          <label className="form__label label">
            Dónde buscas x? :
          </label>
          <input type="text" className="form__input" placeholder="Search Location"></input>


          <div className="info-overlay__nets">

            <input className="dropdown-nets__dropdown-trigger dropdown__dropdown" autoComplete="off" list="" id="input" name="browsers" placeholder="Select other Network" type='text'></input>
            <datalist className="dropdown-nets__dropdown-content" id='listid'>
              <option className="dropdown-nets__dropdown-option" label='label1' value='Net1'>hola</option>
              <option className="dropdown-nets__dropdown-option" label='label2' value='Net2'>hola</option>
              <option className="dropdown-nets__create-new-button" label='label2' value='Net2'>Create Net</option>
            </datalist>

          </div>

        </div>

      </div>

    </>


  );
}
