//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';
import { Picker } from 'components/picker/Picker';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import MarkerSelectorMap from 'components/map/Map/MarkerSelectorMap';
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { DropDownWhere } from 'elements/Dropdown/DropDownWhere';
import { FindAddress } from 'state/Explore';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import t from 'i18n';
export default function FieldLocation({
  validationError,
  setMarkerPosition,
  markerImage,
  markerCaption = '?',
  markerColor,
  markerPosition,
  markerAddress,
  markerZoom,
  selectedNetwork = null,
  setMarkerAddress,
  setZoom,
  label,
}) {
  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  let closeMenu = () => {
    setHideMenu(false);
  };

  const [showHideMenu, setHideMenu] = useState(false);
  const handleSelectedPlace = (place) => {
    updateLocation([place.geometry.lat, place.geometry.lng])
  };

  const updateLocation = (newLatLng) => {
    if(newLatLng && markerPosition && markerPosition[0] == newLatLng[0] && markerPosition[1] == newLatLng[1] )
    {
      return;
    }
    const decimals = 10000;
    setMarkerPosition([(Math.round(newLatLng[0] * decimals) / decimals), (Math.round(newLatLng[1] * decimals) / decimals)]);
    
    setMarkerAddress('...')
    store.emit(
      new FindAddress(
        JSON.stringify({
          apikey: config.mapifyApiKey,
          address: newLatLng.join('+'),
        }),
        (place) => {
          const address = place.results[0].formatted;
          setMarkerAddress(address);
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
          latitude={markerPosition[0]}
          longitude={markerPosition[1]}
          address={markerAddress}
          label={label}
        />
        <div
          className="btn"
          onClick={() => setHideMenu(!showHideMenu)}
        >
          {t('button.changePlace')}
        </div>
      </div>

      {showHideMenu && markerPosition && (
       
            <Picker closeAction={closeMenu}>

              <MarkerSelectorMap
                updateMarkerPosition={updateLocation}
                handleZoomChange={(zoom) => setZoom(zoom)}
                zoom={markerZoom}
                markerImage={markerImage ? markerImage : selectedNetwork.logo}
                markerCaption={markerCaption ? markerCaption : '?'}
                markerColor={markerColor ? markerColor : 'yellow'}
                markerPosition={markerPosition}
              />
              <LocationCoordinates
                latitude={markerPosition[0]}
                longitude={markerPosition[1]}
                address={markerAddress}
              />
              <DropDownSearchLocation
                placeholder={t('homeinfo.searchlocation')}
                handleSelectedPlace={handleSelectedPlace}
              />
              <Btn
                btnType={BtnType.submit}
                caption={t('common.save')}
                contentAlignment={ContentAlignment.center}
                onClick={() => setHideMenu(!showHideMenu)}
              />

            </Picker>

      )}
      <span style={{color:'red'}}>{validationError}</span>
    </>
  );
}

function LocationCoordinates({
  latitude,
  longitude,
  address,
  label,
}) {
  return (
    <div className="card-button__city card-button__everywhere">
      {address && address.length > 1 ? 
        <>
          <span>{address}</span>
          <span> ({latitude},{longitude})</span>
          {/* (radius: ${radius} km) */}
        </>
        :
        <>{label}</>
      }
    </div>
  );
}
