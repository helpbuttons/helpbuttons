//INFO AND RESULTS
//libraries
import { useRef } from 'store/Store';
import { store } from 'pages/index';
import { LoadCommonNetworks } from 'pages/Common/data';
import { LoadCommonSelectedNetwork } from 'pages/Common/data';
import Router from 'next/router';

import { useState, useEffect } from "react";

//services
import { storeService } from 'services/Store';
import { alertService } from 'services/Alert';

//components
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'
import { Link } from 'elements/Link';



export default function HomeInfo() {

  // const [networks, setNetworks] = useState(useRef(store, (state) => state.commonData.networks));
  const networks = useRef(store, (state) => state.commonData.networks);
  const [selectedNetworkId, setSelectedNetworkId] = useState(useRef( store, (state) => {

      return storeService.read('network_id');

    })
  );

  useEffect(() => {

    if(storeService.read('network_id') == null)
    {

      alertService.info('It looks like youre new ! First, create your network');
      Router.push({ pathname: '/NetworkNew'});
    }

    alertService.info("You're in the " + storeService.read('network_id') + " network !");

    store.emit(new LoadCommonNetworks());

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
