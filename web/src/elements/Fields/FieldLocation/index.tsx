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
import { Point } from 'pigeon-maps';
export default function FieldLocation({
  validationError,
  markerImage,
  markerCaption = '?',
  markerColor,
  markerAddress,
  selectedNetwork = null,
  updateAddress,
  updateMarkerPosition,
  label,
}) {
  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  const [markerPosition, setMarkerPosition] = useState<Point>([0, 0]);
  let closeMenu = () => {
    setHideMenu(false);
  };

  const [showHideMenu, setHideMenu] = useState(false);
  const handleSelectedPlace = (place) => {
    setMarkerPosition([place.geometry.lat, place.geometry.lng])
  };
  
  const requestAddressForPosition = (markerPosition) => {
    store.emit(
      new FindAddress(
        JSON.stringify({
          apikey: config.mapifyApiKey,
          address: markerPosition.join('+'),
        }),
        (place) => {
          const address = place.results[0].formatted;
          updateAddress(address);
        },
        () => {
          console.log(
            'error, no address found, mapifyapi not configured?',
          );
        },
      ),
    );
  }
  useEffect(() => {
    updateMarkerPosition(markerPosition);
    updateAddress('...');
    if(!config)
    {
      console.error('config not defined.. could not get address for location')
      return;
    } else {
      requestAddressForPosition(markerPosition)
    }
    
  }, [markerPosition]);

  useEffect(() => {
    if(selectedNetwork)
    {
      console.log(selectedNetwork.exploreSettings.center)
      setMarkerPosition(selectedNetwork.exploreSettings.center)
    }
  }, [selectedNetwork])
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
          {t('button.changePlaceLabel')}
        </div>
      </div>

      {showHideMenu && markerPosition && (
        <Picker closeAction={closeMenu} headerText={t('picker.headerText')}>
          <DropDownSearchLocation
            placeholder={t('homeinfo.searchlocation')}
            handleSelectedPlace={handleSelectedPlace}
          />
           <LocationCoordinates
            latitude={markerPosition[0]}
            longitude={markerPosition[1]}
            address={markerAddress}
          />
          <MarkerSelectorMap
            setMarkerPosition={setMarkerPosition}
            defaultZoom={selectedNetwork.zoom}
            markerColor={markerColor ? markerColor : 'yellow'}
            markerPosition={markerPosition}
          />
          <Btn
            btnType={BtnType.submit}
            caption={t('common.save')}
            contentAlignment={ContentAlignment.center}
            onClick={() => setHideMenu(!showHideMenu)}
          />
        </Picker>
      )}
      <span style={{ color: 'red' }}>{validationError}</span>
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
    <div className="card-button__city card-button__everywhere form__label">
      {address && address.length > 1 ? (
        <>
          <span>{address}</span>
          <span>
            {' '}
            ({latitude},{longitude})
          </span>
          {/* (radius: ${radius} km) */}
        </>
      ) : (
        <>{label}</>
      )}
    </div>
  );
}
