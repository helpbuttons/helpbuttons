//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { MarkerEditorMap } from 'components/map/Map/MarkerSelectorMap';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import t from 'i18n';
import { roundCoord } from 'shared/honeycomb.utils';
import { ReverseGeo } from 'state/Explore';
import { FieldCheckbox } from '../FieldCheckbox';
import PickerField from 'components/picker/PickerField';
export default function FieldLocation({
  validationError,
  markerImage,
  markerCaption = '?',
  markerColor,
  markerAddress,
  selectedNetwork,
  updateAddress,
  setMarkerPosition,
  markerPosition,
  explain = '',
  label,
  watch,
  setValue,
}) {

  const hideAddress = watch('hideAddress');
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  const config: SetupDtoOut = useStore(
    store,
    (state: GlobalState) => state.config,
  );

  let closeMenu = () => {
    setShowPopup(() => false);
  };

  const requestAddressForMarkerPosition = (latLng, success) => {
    store.emit(
      new ReverseGeo(
        latLng[0],
        latLng[1],
        (place) => {
          success(place)
        },
        () => {
          console.log('error getting address from coordinates')
        },
      ),
    );
  }
  const setLocation = (latLng, place = null) => {
    setMarkerPosition([latLng[0], latLng[1]]);
    if (place) {
      if (hideAddress) {
        updateAddress(place.formatted_city);
      } else {
        updateAddress(place.formatted);
      }
    } else {
      requestAddressForMarkerPosition(latLng, (place) => {
        if (hideAddress) {
          updateAddress(place.formatted_city);
        } else {
          updateAddress(place.formatted);
        }
      } )
      
    }
  };
  useEffect(() => {
    requestAddressForMarkerPosition([latitude, longitude], (place) => {
      if (hideAddress) {
        updateAddress(place.formatted_city);
      } else {
        updateAddress(place.formatted);
      }
    } )
   
  }, [hideAddress])
  const onMapClick = (latLng) => {
    setLocation(latLng);
  };

  const [showPopup, setShowPopup] = useState(false);

  // place searched on dropdown...
  const handleSelectedPlace = (newPlace) => {
    setLocation(
      [newPlace.geometry.lat, newPlace.geometry.lng],
      newPlace,
    );
  };


  useEffect(() => {
    if (selectedNetwork && !markerPosition) {
      setLocation(selectedNetwork.exploreSettings.center);
    }
  }, [selectedNetwork]);

  const closePopup = () => setShowPopup(() => false);
  const openPopup = () => setShowPopup(() => true);
  return (
    <>
      <PickerField
        showPopup={showPopup}
        validationError={validationError}
        label={t('button.whereLabel')}
        btnLabel={
          <LocationCoordinates
            latitude={markerPosition[0]}
            longitude={markerPosition[1]}
            address={markerAddress}
            label={label}
          />
        }
        headerText={t('picker.headerText')}
        explain={t('button.whereExplain')}
        openPopup={openPopup}
        closePopup={closePopup}
      >
        {markerAddress}
        <DropDownSearchLocation
          placeholder={t('homeinfo.searchlocation')}
          handleSelectedPlace={handleSelectedPlace}
        />
        <MarkerEditorMap
          onMapClick={onMapClick}
          defaultZoom={selectedNetwork.exploreSettings.zoom}
          markerColor={markerColor ? markerColor : 'pink'}
          markerPosition={markerPosition}
          markerCaption={markerCaption}
          markerImage={markerImage}
          showHexagon={hideAddress}
        />
        <FieldCheckbox
          name="hideAddress"
          defaultValue={watch('hideAddress')}
          text={t('button.hideAddress')}
          onChanged={(value) => setValue('hideAddress', value)}
        />
        <Btn
          btnType={BtnType.submit}
          caption={t('common.save')}
          contentAlignment={ContentAlignment.center}
          onClick={() => setShowPopup(!showPopup)}
        />
      </PickerField>
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
    <>
      {address || (longitude && latitude) ? (
        <>
          {address && <span>{address}</span>}
          {latitude && longitude && (
            <span>
              {' '}
              ({roundCoord(latitude)},{roundCoord(longitude)})
            </span>
          )}
          {/* (radius: ${radius} km) */}
        </>
      ) : (
        <>{label}</>
      )}
    </>
  );
}
