import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { MarkerEditorMap } from 'components/map/Map/MarkerSelectorMap';
import t from 'i18n';
import { roundCoord, roundCoords } from 'shared/honeycomb.utils';
import { FieldCheckbox } from '../FieldCheckbox';
import PickerField from 'components/picker/PickerField';
import { minZoom } from 'components/map/Map/Map.consts';
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
  explain = '',
  label,
  setHideAddress,
  hideAddress,
  setLatitude,
  setLongitude,
  defaultMarkerPosition
}) {
  const [markerPosition, setMarkerPosition] = useState(roundCoords(defaultMarkerPosition))

  const [zoom, setZoom] = useState(selectedNetwork.exploreSettings.zoom);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [mapAddress, setMapAddress] = useState({address: markerAddress, hideAddress: hideAddress})
  
  const unsavedMarkerAdress = useRef(markerAddress)
  const closeWithoutSaving = () => {
    setMarkerAddress(unsavedMarkerAdress.current)
    setShowPopup(() => false)
  }
  const closeAndSave = () => {
    unsavedMarkerAdress.current = markerAddress
    setLatitude(markerPosition[0])
    setLongitude(markerPosition[1])
    setShowPopup(() => false)
  }
  const openPopup = () => setShowPopup(() => true)

  const [isCustomAddress, setIsCustomAddress] = useState(false)

  const onMapClick = (latLng) => {
    setMarkerPosition(() => latLng)
    findAddressFromPosition(latLng, hideAddress)
  }

  const getLatLngAddress = useGeoReverse()
  const findAddressFromPosition = (latLng, hideAddress) => {
    setIsLoading(() => true)
    getLatLngAddress(latLng, hideAddress, (place) => {
      setMapAddress(() => {return {address: place.formatted, hideAddress: hideAddress}})
      setIsLoading(() => false)
    },
      (error) => {
        setIsLoading(() => false)
        setMapAddress(() => {return {address: t('button.unknownPlace'), hideAddress: null}})
      }
    );
  }
  
  useEffect(() => {
    if (!isCustomAddress) {
      setMarkerAddress(mapAddress.address)
    }
  }, [mapAddress, isCustomAddress])

  useEffect(() => {
    findAddressFromPosition(markerPosition, hideAddress)
  }, [])
  useEffect(() => {
    if(hideAddress != mapAddress.hideAddress){
        findAddressFromPosition(markerPosition, hideAddress)
    }
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
      markerPosition={markerPosition}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      mapAddress={mapAddress}
    />
    <MarkerEditorMap
      toggleLoadingNewAddress={() => setIsLoading(() => true)}
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
