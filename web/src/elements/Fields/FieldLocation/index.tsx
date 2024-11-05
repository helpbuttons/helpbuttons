//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { MarkerEditorMap } from 'components/map/Map/MarkerSelectorMap';
import { store } from 'pages';
import t from 'i18n';
import { roundCoord } from 'shared/honeycomb.utils';
import { FieldCheckbox } from '../FieldCheckbox';
import PickerField from 'components/picker/PickerField';
import { useToggle } from 'shared/custom.hooks';
import { GeoReverseFindAddress } from 'state/Geo';
import { maxZoom } from 'components/map/Map/Map.consts';
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
  const [loadingNewAddress, toggleLoadingNewAddress] =
    useToggle(false);
  let closeMenu = () => {
    setShowPopup(() => false);
  };
  const [zoom, setZoom] = useState((markerPosition[0] && markerPosition[1]) ? maxZoom : selectedNetwork.exploreSettings.zoom);

  const requestAddressForMarkerPosition = (latLng, success) => {
    toggleLoadingNewAddress(() => true);
    store.emit(
      new GeoReverseFindAddress(latLng[0], latLng[1], (place) => {
        toggleLoadingNewAddress(() => false);
        success(place);
      }),
    );
  };
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
      });
    }
  };
  useEffect(() => {
    if (latitude && longitude) {
      requestAddressForMarkerPosition(
        [latitude, longitude],
        (place) => {
          if (hideAddress) {
            updateAddress(place.formatted_city);
          } else {
            updateAddress(place.formatted);
          }
        },
      );
    }
  }, [hideAddress]);

  const onMapClick = (latLng) => {
    setLocation(latLng);
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleSelectedPlace = (newPlace) => {
    setLocation(
      [newPlace.geometry.lat, newPlace.geometry.lng],
      newPlace,
    );
    setZoom(() => maxZoom)
  };
  const closePopup = () => setShowPopup(() => false);
  const openPopup = () => setShowPopup(() => true);
  return (
    <>
      {selectedNetwork?.exploreSettings?.center && (
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
            <MarkerEditorMap
              loadingNewAddress={loadingNewAddress}
              onMapClick={onMapClick}
              zoom={zoom}
              setZoom={setZoom}
              markerColor={markerColor ? markerColor : 'pink'}
              markerPosition={markerPosition}
              markerCaption={markerCaption}
              markerImage={markerImage}
              showHexagon={hideAddress}
              handleSelectedPlace={handleSelectedPlace}
              markerAddress={markerAddress}
              networkMapCenter={selectedNetwork.exploreSettings.center}
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
      )}
    </>
  );
}

export function LocationCoordinates({
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
