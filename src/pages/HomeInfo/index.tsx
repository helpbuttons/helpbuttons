//INFO AND RESULTS
import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';


import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'
import { Link } from 'elements/Link';



export default function Faqs() {


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

            <form className="info-overlay__location">

              <label className="form__label label">
                Where do you go?
              </label>

              <input type="text" className="form__input" placeholder="Search Location"></input>

            </form>

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
