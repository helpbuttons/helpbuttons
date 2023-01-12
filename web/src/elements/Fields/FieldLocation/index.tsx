//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';
import FieldNumber from '../FieldNumber';
import FieldError from '../FieldError';
import 'leaflet/dist/leaflet.css';

import Map from 'components/map/LeafletMap';
import { useController } from 'react-hook-form';
import MapSelector from 'components/map/LeafletMap/MapSelector';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { ImageContainer } from 'elements/ImageWrapper';
export default function FieldLocation({
  validationErrors,
  initMapCenter,
  setValue,
  watch,
  defaultZoom,
  markerImage,
  markerCaption = '?'
}) {
  const [showHideMenu, setHideMenu] = useState(false);
  const [radius, setRadius] = useState(1);
  const onClick = (e) => {
    console.log('clicked')
    setValue('latitude', Math.round(e.lat * 10000) / 10000);
    setValue('longitude', Math.round(e.lng * 10000) / 10000);
  };

  const latitude = watch('latitude');
  const longitude = watch('longitude');

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
            <MapSelector
              onMarkerClick={onClick}
              markerPosition={
                latitude ? { lat: latitude, lng: longitude } : null
              }
              initMapCenter={initMapCenter}
              defaultZoom={defaultZoom}
              markerImage={
                markerImage?.data_url ? markerImage.data_url : null
              }
              markerCaption={markerCaption}
            />
            <LocationCoordinates
              longitude={longitude}
              latitude={latitude}
              radius={0}/>
              YELLOW
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
