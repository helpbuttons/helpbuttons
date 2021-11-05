//INFO AND RESULTS
import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'
import { Link } from 'elements/Link';

export default function Faqs() {

  return (

    <>

      <div className="info-overlay__container">

        <div className="info-overlay__content">

          <div className="info-overlay__name">
            Network Name
          </div>

          <div className="info-overlay__description">
            Network description
          </div>

          <div className="info-overlay__image">

            <div className="info-overlay__location">

              <label className="form__label label">
                Where do you go?
              </label>

              <input type="text" className="form__input" placeholder="Search Location"></input>

            </div>

          </div>

          <div className="info-overlay__bottom">

            <div className="info-overlay__nets">

              <input className="dropdown-nets__dropdown-trigger dropdown__dropdown" autoComplete="off" list="" id="input" name="browsers" placeholder="Select other Network" type='text'></input>
              <datalist className="dropdown-nets__dropdown-content" id='listid'>
                <option className="dropdown-nets__dropdown-option" label='label1' value='Net1'>hola</option>
                <option className="dropdown-nets__dropdown-option" label='label2' value='Net2'>hola</option>
                <option className="dropdown-nets__create-new-button" label='label2' value='Net2'>Create Net</option>
              </datalist>

              <Link href="/NetworkNew">
                <Btn btnType={BtnType.corporative} contentAlignment={ContentAlignment.center} caption="Create Network"  />
              </Link>

            </div>

          </div>

        </div>

      </div>

    </>


  );
}
