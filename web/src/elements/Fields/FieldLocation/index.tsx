//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import MarkerSelectorMap from 'components/map/Map/MarkerSelectorMap';
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { DropDownWhere } from 'elements/Dropdown/DropDownWhere';
import { FindAddress } from 'state/Explore';
import { SetupDtoOut } from 'shared/entities/setup.entity';
export default function FieldLocation({
  validationErrors,
  setValue,
  watch,
  markerImage,
  markerCaption = '?',
  markerColor,
  selectedNetwork = null,
}) {
  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  const watchLatitude = watch('latitude');
  const watchLongitude = watch('longitude');
  const watchZoom = watch('zoom');
  const watchRadius = watch('radius');

  const [showHideMenu, setHideMenu] = useState(false);
  const [address, setAddress] = useState('-');
  const [radius, setRadius] = useState(1);
  const [latLng, setLatLng] = useState(selectedNetwork ? [selectedNetwork.latitude,selectedNetwork.longitude]: [41.687,-7.7406])
  const [zoom, setZoom] = useState(selectedNetwork ? selectedNetwork.zoom : 10)
  
  const updateZoom = (newZoom) => {
    setZoom(newZoom)
    setValue('zoom', newZoom);
  };

  const updateLocation = (newLatLng) => {
    const decimals = 1000000;
    setLatLng([(Math.round(newLatLng[0] * decimals) / decimals), (Math.round(newLatLng[1] * decimals) / decimals)]);

    setValue(
      'latitude',
      latLng[0].toString(),
    );
    setValue(
      'longitude',
      latLng[1].toString(),
    );
    setAddress('...')
    store.emit(
      new FindAddress(
        JSON.stringify({
          apikey: config.mapifyApiKey,
          address: newLatLng.join('+'),
        }),
        (place) => {
          const address = place.results[0].formatted;

          setValue('address', address);
          setAddress(address);
        },
        () => {
          console.log(
            'error, no address found, mapifyapi not configured?',
          );
        },
      ),
    );
  };

  return (
    <>
      <div className="form__field">
        <LocationCoordinates
          latitude={watchLatitude}
          longitude={watchLongitude}
          address={address}
        />
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

      {showHideMenu && latLng && (
        <div className="picker__close-container">
          <div className="picker--over picker-box-shadow picker__content picker__options-v">
            <MarkerSelectorMap
              updateMarkerPosition={updateLocation}
              handleZoomChange={updateZoom}
              defaultZoom={zoom}
              markerImage={markerImage}
              markerCaption={markerCaption ? markerCaption : '...'}
              markerColor={markerColor}
              markerPosition={latLng}
            />
            <LocationCoordinates
              latitude={latLng[0]}
              longitude={latLng[1]}
              address={address}
            />
            {/* <DropDownWhere
              placeholder={t('homeinfo.searchlocation')}
              onSelected={(place) => {
                console.log(place);
                // setCenter(place.coordinates)
              }}
            /> */}
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

function LocationCoordinates({
  latitude,
  longitude,
  address,
}) {
  return (
    <div className="card-button__city card-button__everywhere">
      <p>{address}</p>
      <p>{latitude || longitude
        ? ` (${latitude}, ${longitude})`
        : 'Where ?'}</p>
      {/* (radius: ${radius} km) */}
    </div>
  );
}
