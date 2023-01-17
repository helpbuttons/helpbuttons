//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import MarkerSelectorMap from 'components/map/LeafletMap/MarkerSelectorMap';
import { ImageContainer } from 'elements/ImageWrapper';
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
export default function FieldLocation({
  validationErrors,
  setValue,
  watch,
  defaultZoom,
  markerImage,
  markerCaption = '?'
}) {
  const [showHideMenu, setHideMenu] = useState(false);
  const [center, setCenter] = useState(["41.6869","-7.663206"]);
  const [radius, setRadius] = useState(1);


  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork
  );
  
  const onClick = (e, zoom) => {
    const newCenter = [
      (Math.round(e.lat * 10000) / 10000).toString(),
      (Math.round(e.lng * 10000) / 10000).toString(),
    ];
    
    setValue('latitude', newCenter[0]);
    setValue('longitude', newCenter[1]);
    setValue('zoom', zoom)
    setCenter(newCenter)
  };
  
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  useEffect(() => {
    if (selectedNetwork)
    {
      setCenter(selectedNetwork.location.coordinates);
    }
  }, [selectedNetwork])
  return (
    <>
      <div className="form__field">
          <LocationCoordinates
              longitude={longitude}
              latitude={latitude}
              radius={0}/>
        <div
          className="btn"
          onClick={() => setHideMenu(!showHideMenu)}
        >
          Change place
        </div>
        {/* <FieldError validationError={validationErrors.latitude} />
        <FieldError validationError={validationErrors.longitude} />
        <FieldError validationError={validationErrors.radius} /> */}
      </div>

      {showHideMenu && (
        <div className="picker__close-container">
          <div className="picker--over picker-box-shadow picker__content picker__options-v">
            <MarkerSelectorMap
              onMarkerClick={onClick}
              markerPosition={
                latitude ? { lat: latitude, lng: longitude } : null
              }
              initMapCenter={center}
              defaultZoom={defaultZoom}
              markerImage={
                markerImage ? markerImage : null
              }
              markerCaption={markerCaption}
            />
            <LocationCoordinates
              longitude={longitude}
              latitude={latitude}
              radius={0}/>
            <Btn
              btnType={BtnType.splitIcon}
              caption="Save"
              contentAlignment={ContentAlignment.center}
              onClick={() => setHideMenu(!showHideMenu)}
            />
          </div>

          <div
            className="picker__close-overlay"
            onClick={() => setHideMenu(false)}
          ></div>
        </div>
      )}
    </>
  );
}

function LocationCoordinates({ longitude, latitude, radius }) {
  return (
    <div className="card-button__city card-button__everywhere">
      {latitude || longitude
        ? `${latitude}, ${longitude} (radius: ${radius} km) `
        : 'Where ?'}
    </div>
  );
}
