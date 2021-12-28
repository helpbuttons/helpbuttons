//INFO AND RESULTS
//libraries
import { useRef } from 'store/Store';
import { store } from 'pages/index';
import { LoadCommonData } from 'modules/Common/data';

import { useState, useEffect } from "react";

import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'
import { Link } from 'elements/Link';



export default function HomeInfo() {

  // const [networks, setNetworks] = useState(useRef(store, (state) => state.commonData.networks));
  const networks = useRef(store, (state) => state.commonData.networks);


  useEffect(() => {

    store.emit(new LoadCommonData());

  }, [])

  return (

    <>

      <div className="info-overlay__container">

        <div className="info-overlay__content">

          <div className="info-overlay__name">
          </div>

          <div className="info-overlay__description">
          </div>

          <div className="info-overlay__image">

            <form className="info-overlay__location">

              <label className="form__label label">
                Where do you start?
              </label>

              <input type="text" className="form__input" placeholder="Search Location"></input>

            </form>

          </div>

          <div className="info-overlay__bottom">

            <div className="info-overlay__nets">



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
