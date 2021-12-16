//INFO AND RESULTS
//libraries
import { useState, useEffect } from "react";
import { useMap } from 'react-leaflet';

//services
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { GetNetworksEvent, GetNetworkByIdEvent } from 'pages/HomeInfo/data.tsx';
import { useRef } from '../../store/Store';
import { store } from '../index';
import { LoadCommonData } from 'modules/Common/data';
import INetwork from 'services/Networks/network.type.tsx'

//components
import DropdownNetworks from 'components/network/DropdownNetworks'
import Directory from 'elements/Directory'
import Accordion from 'elements/Accordion'
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'
import { Link } from 'elements/Link';



export default function HomeInfo() {

  const [networks, setNetworks] = useState(useRef(store, (state) => state.commonData.networks));

  const [selectedNetworkObject, setSelectedNetworkObject] = useState({
    id: "",
    name:"",
  });


  const SearchField = ({ apiKey }) => {
    const provider = new MapBoxProvider({
      params: {
        access_token: apiKey,
      },
    });

    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
    });


    // const map = useMap();
    //
    // useEffect(() => {
    //   map.addControl(searchControl);
    //   return () => map.removeControl(searchControl);
    // }, []);

    new GeoSearchControl({
      provider: myProvider, // required
      showMarker: true, // optional: true|false  - default true
      showPopup: false, // optional: true|false  - default false
      marker: {
        // optional: L.Marker    - default L.Icon.Default
        icon: new L.Icon.Default(),
        draggable: false,
      },
      popupFormat: ({ query, result }) => result.label, // optional: function    - default returns result label,
      resultFormat: ({ result }) => result.label, // optional: function    - default returns result label
      maxMarkers: 1, // optional: number      - default 1
      retainZoomLevel: false, // optional: true|false  - default false
      animateZoom: true, // optional: true|false  - default true
      autoClose: false, // optional: true|false  - default false
      searchLabel: 'Enter address', // optional: string      - default 'Enter address'
      keepResult: false, // optional: true|false  - default false
      updateMap: true, // optional: true|false  - default true
    });

    return null;
  }


  useEffect(() => {

    store.emit(new LoadCommonData());
    // GetNetworksEvent(setNetworks);
    // GetNetworkByIdEvent(selectedNetwork, setSelectedNetworkObject);

  }, [])

  return (

    <>

      <div className="info-overlay__container">

        <div className="info-overlay__content">

          <div className="info-overlay__name">
            {selectedNetworkObject.name}
          </div>

          <div className="info-overlay__description">
            {selectedNetworkObject.description}
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

              <DropdownNetworks  networks={networks} setSelectedNetworkObject={setSelectedNetworkObject} net='string'/>

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
