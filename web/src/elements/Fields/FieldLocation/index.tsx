//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { MarkerEditorMap } from 'components/map/Map/MarkerSelectorMap';
import t from 'i18n';
import { roundCoord } from 'shared/honeycomb.utils';
import { FieldCheckbox } from '../FieldCheckbox';
import PickerField from 'components/picker/PickerField';
import { maxZoom } from 'components/map/Map/Map.consts';
import { useGeoReverse } from './location.helpers';


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
  const [loadingNewAddress, setLoadingNewAddress] = useState(false)
  const [zoom, setZoom] = useState(
    markerPosition[0] && markerPosition[1]
      ? maxZoom
      : selectedNetwork.exploreSettings.zoom,
  );

  const geoReverse = useGeoReverse()
  const setLocation = (latLng, place = null) => {
    setPickedMarkerPosition(() => [
      Number.parseFloat(latLng[0]),
      Number.parseFloat(latLng[1]),
    ]);
    
    if (place) {
      setLoadingNewAddress(() => false)
      
      setPickedPlace(() => place);
      if (hideAddress) {
        setPickedAddress(() => place.formatted_city);
      } else {
        setPickedAddress(() => place.formatted);
      }
    } else {
      setLoadingNewAddress(() => true)
      geoReverse(latLng, (place) => {
        setLoadingNewAddress(() => false)
        setPickedPlace(() => place);
        if (hideAddress) {
          setPickedAddress(() => place.formatted_city);
        } else {
          if(place)
          {
            setPickedAddress(() => place.formatted);
          }else{
            setPickedAddress(() => t('button.unknownPlace'));
          }
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
            loadingNewAddress={loadingNewAddress}
            toggleLoadingNewAddress={(value) =>
              setLoadingNewAddress(() => value)
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
            disabled={!!loadingNewAddress}
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
