//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { MarkerEditorMap } from 'components/map/Map/MarkerSelectorMap';
import { store } from 'pages';
import t from 'i18n';
import { roundCoord } from 'shared/honeycomb.utils';
import { FieldCheckbox } from '../FieldCheckbox';
import PickerField from 'components/picker/PickerField';
import { useToggle } from 'shared/custom.hooks';
import {
  GeoFindAddress,
  GeoReverseFindAddress,
  emptyPlace,
} from 'state/Geo';
import { maxZoom } from 'components/map/Map/Map.consts';
import debounce from 'lodash.debounce';
import { set } from 'immer/dist/internal';

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
  const [pickedMarkerPosition, setPickedMarkerPosition] =
    useState(markerPosition);
  const [pickedAddress, setPickedAddress] = useState(markerAddress);
  const [pickedPlace, setPickedPlace] = useState(null);
  const hideAddress = watch('hideAddress');
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const loadingNewAddress = useRef(false);
  const [zoom, setZoom] = useState(
    markerPosition[0] && markerPosition[1]
      ? maxZoom
      : selectedNetwork.exploreSettings.zoom,
  );

  const GeofindReverse = useCallback(
    debounce((latLng, success) => {
      store.emit(
        new GeoReverseFindAddress(
          latLng[0],
          latLng[1],
          (place) => {
            loadingNewAddress.current = false;
            success(place);
          },
          (error) => {
            loadingNewAddress.current = false;
            success(emptyPlace({ lat: latLng[0], lng: latLng[1] }));
            console.log(error);
          },
        ),
      );
    }, 500),
    [],
  );

  const GeoFindByQuery = useCallback(
    debounce((query, callback) => {
      loadingNewAddress.current = true;
      store.emit(
        new GeoFindAddress(query, (places) => {
          loadingNewAddress.current = false;
          return callback(places);
        }),
      );
    }, 500),
    [],
  );

  const requestPlacesForQuery = (query, success) => {
    GeoFindByQuery(query, (places) => success(places));
  };

  const requestAddressForMarkerPosition = (latLng, success) => {
    GeofindReverse(latLng, success);
  };
  const setLocation = (latLng, place = null) => {
    setPickedMarkerPosition(() => [
      Number.parseFloat(latLng[0]),
      Number.parseFloat(latLng[1]),
    ]);
    
    if (place) {
      setPickedPlace(() => place);
      if (hideAddress) {
        setPickedAddress(() => place.formatted_city);
      } else {
        setPickedAddress(() => place.formatted);
      }
    } else {
      requestAddressForMarkerPosition(latLng, (place) => {
        setPickedPlace(() => place);
        if (hideAddress) {
          setPickedAddress(() => place.formatted_city);
        } else {
          setPickedAddress(() => place.formatted);
        }
      });
    }
  };
  useEffect(() => {
    if (pickedPlace) {
      if (hideAddress) {
        setPickedAddress(() => pickedPlace.formatted_city);
      } else {
        setPickedAddress(() => pickedPlace.formatted);
      }
    }
  }, [hideAddress, pickedPlace]);

  const onMapClick = (latLng) => {
    setLocation(latLng);
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleSelectedPlace = (newPlace) => {
    setLocation(
      [newPlace.geometry.lat, newPlace.geometry.lng],
      newPlace,
    );
    setZoom(() => maxZoom);
  };
  const closeWithoutSaving = () => {
    setShowPopup(() => false);
    setPickedAddress('');
    setPickedMarkerPosition([null, null]);
  };
  const closeAndSave = () => {
    updateAddress(pickedAddress);
    setMarkerPosition(pickedMarkerPosition);
    setShowPopup(() => false);
  };
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
          closePopup={closeWithoutSaving}
        >
          <MarkerEditorMap
            loadingNewAddress={loadingNewAddress.current}
            toggleLoadingNewAddress={(value) =>
              (loadingNewAddress.current = value)
            }
            onMapClick={onMapClick}
            zoom={zoom}
            setZoom={setZoom}
            markerColor={markerColor ? markerColor : 'pink'}
            markerPosition={pickedMarkerPosition}
            markerCaption={markerCaption}
            markerImage={markerImage}
            hideAddress={hideAddress}
            handleSelectedPlace={handleSelectedPlace}
            markerAddress={pickedAddress}
            networkMapCenter={selectedNetwork.exploreSettings.center}
            requestPlacesForQuery={requestPlacesForQuery}
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
            onClick={() => closeAndSave()}
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
