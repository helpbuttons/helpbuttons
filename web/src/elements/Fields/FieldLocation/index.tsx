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
import {  minZoom } from 'components/map/Map/Map.consts';
import { useGeoReverse } from './location.helpers';
import { IoSearchOutline } from 'react-icons/io5';
import LocationSearchBar from 'elements/LocationSearchBar';


export default function FieldLocation({
  validationError,
  markerImage,
  markerCaption = '?',
  markerColor,
  markerAddress,
  selectedNetwork,
  setMarkerAddress,
  setMarkerPosition,
  markerPosition,
  explain = '',
  label,
  setHideAddress,
  hideAddress
}) {
  const [zoom, setZoom] = useState(minZoom);
  const [showPopup, setShowPopup] = useState(false);
  const unsavedMarkerAdress = useRef(markerAddress)
  const unsavedMarkerPosition = useRef(markerPosition)
  const closeWithoutSaving = () => {
    setMarkerAddress(unsavedMarkerAdress.current)
    setMarkerPosition(unsavedMarkerPosition.current)
    setShowPopup(() => false)
  }
  const closeAndSave = () => {
    unsavedMarkerAdress.current = markerAddress
    unsavedMarkerPosition.current = markerPosition
    setShowPopup(() => false)
  }
  const openPopup = () => setShowPopup(() => true)

  const [isCustomAddress, setIsCustomAddress] = useState(false)

  const onMapClick = (latLng) => {
    setMarkerPosition(latLng)
    setMarkerAddress(null)
  }

  const getLatLngAddress = useGeoReverse()

  useEffect(() => {
    if(markerAddress == null)
    {
      getLatLngAddress(markerPosition, hideAddress, (place) => {
        setMarkerAddress(place.formatted)
      });
    }
    
  }, [markerPosition])

  useEffect(() => {
    setMarkerAddress(null)
  }, [hideAddress])


  const loadingNewAddress = markerAddress == null;
  return <PickerField
    iconLink={<IoSearchOutline />}
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
    <LocationSearchBar
      placeholder={t('button.locationPlaceholder')}
      markerAddress={markerAddress}
      hideAddress={hideAddress}
      setMarkerAddress={setMarkerAddress}
      isCustomAddress={isCustomAddress}
      setIsCustomAddress={setIsCustomAddress}
      setMarkerPosition={setMarkerPosition}
    />
    <MarkerEditorMap
      toggleLoadingNewAddress={(value) =>
        setMarkerAddress(false)
      }
      onMapClick={onMapClick}
      zoom={zoom}
      setZoom={setZoom}
      markerColor={markerColor ? markerColor : 'pink'}
      markerPosition={markerPosition}
      markerCaption={markerCaption}
      markerImage={markerImage}
      hideAddress={hideAddress}
      markerAddress={markerAddress}
      networkMapCenter={selectedNetwork.exploreSettings.center}
      editPosition={true}
    />
    <FieldCheckbox
      name="hideAddress"
      defaultValue={hideAddress}
      text={t('button.hideAddress')}
      onChanged={setHideAddress}
    />
    <Btn
      btnType={BtnType.submit}
      caption={t('common.save')}
      contentAlignment={ContentAlignment.center}
      onClick={() => closeAndSave()}
      disabled={loadingNewAddress}
    />
  </PickerField>
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
