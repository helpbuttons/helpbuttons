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
import { useGeoReverse } from './location.helpers';
import { IoLocationOutline } from 'react-icons/io5';
import LocationSearchBar from 'elements/LocationSearchBar';
import { markerFocusZoom } from 'components/map/Map/Map.consts';
import { alertService } from 'services/Alert';

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
  isCustomAddress,
  setIsCustomAddress,
  markerPosition,
  onCloseAndSave = (place, close) => { },
  isLocationKey = false,
}) {
  const [pickedPosition, setPickedPosition] = useState(markerPosition)
  const [zoom, setZoom] = useState(markerPosition ? markerFocusZoom : selectedNetwork.exploreSettings.zoom );
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [pickedAddress, setPickedAddress] = useState(markerAddress)
  const [findNewAddress, setFindNewAddress] = useState(false)
  const closeWithoutSaving = () => {

    setPickedAddress(() => markerAddress)
    setPickedPosition(() => markerPosition)
    setShowPopup(() => false)
  }
  useEffect(() => {
    if(!isCustomAddress && pickedPosition[0] != null){
      getLatLngAddress(pickedPosition, hideAddress, (place) => {
        const address = place.formatted;
        setPickedAddress(() => address)
      },
        (error) => {
          const address = t('button.unknownPlace')
          setPickedAddress(address)
          setLatitude(pickedPosition[0])
          setLongitude(pickedPosition[1])
          setShowPopup(() => false)
        }
      );
    }
  }, [hideAddress])
  const closeAndSave = () => {
    if (isLocationKey) {
      onCloseAndSave({ address: pickedAddress, latitude: Number(pickedPosition[0]), longitude: Number(pickedPosition[1]) }, () => {
        setShowPopup(() => false)
        setPickedAddress(() => null)
        setPickedPosition(() => selectedNetwork.exploreSettings.center)
        setZoom(() => selectedNetwork.exploreSettings.zoom)
      })
    } else {
      if(!pickedAddress || pickedAddress.length < 1){
        console.log('error no address defined')
        return;
      }
      if(pickedPosition[0] == null)
      {
        alertService.warn(t('button.pickPosition'))
        return;
      }
      setMarkerAddress(pickedAddress)
      setLatitude(pickedPosition[0])
      setLongitude(pickedPosition[1])
      setShowPopup(() => false)
    }

  }
  const openPopup = () => setShowPopup(() => true)

  const onMapClick = (latLng) => {
    setPickedPosition(() => latLng)
    setFindNewAddress(() => true)
  }

  useEffect(() => {
    if (!isCustomAddress && findNewAddress) {
      findAddressFromPosition(pickedPosition)
    }else{
      setIsLoading(() => false)
    }
  }, [findNewAddress, pickedPosition])

  const getLatLngAddress = useGeoReverse()
  const findAddressFromPosition = (latLng) => {

    setIsLoading(() => true)
    if (latLng[0] && latLng[1]) {
      getLatLngAddress(latLng, hideAddress, (place) => {
        setPickedAddress(() => place.formatted)
        setIsLoading(() => false)
      },
        (error) => {
          setIsLoading(() => false)
          setPickedAddress(() => t('button.unknownPlace'))
        }
      );
    }
  }

  useEffect(() => {
    if (!isCustomAddress && pickedPosition) {
      findAddressFromPosition(pickedPosition)
    }
  }, [isCustomAddress])

  return <PickerField
    iconLink={<IoLocationOutline />}
    showPopup={showPopup}
    validationError={validationError}
    label={t('button.whereLabel')}
    btnLabel={
      markerPosition ? <LocationCoordinates
        latitude={markerPosition[0]}
        longitude={markerPosition[1]}
        address={markerAddress}
        label={label}
      /> : t('button.whereButtonLabel')
    }
    headerText={t('picker.headerText')}
    explain={t('button.whereExplain')}
    openPopup={openPopup}
    closePopup={closeWithoutSaving}
  >
    <LocationSearchBar
      placeholder={t('button.locationPlaceholder')}
      hideAddress={hideAddress}
      isCustomAddress={isCustomAddress}
      setIsCustomAddress={setIsCustomAddress}
      setPickedPosition={setPickedPosition}
      pickedPosition={pickedPosition}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      pickedAddress={pickedAddress}
      setPickedAddress={setPickedAddress}
      focusPoint={pickedPosition ? pickedPosition : selectedNetwork.exploreSettings.center}
    />
    <MarkerEditorMap
      toggleLoadingNewAddress={() => setIsLoading(() => true)}
      onMapClick={onMapClick}
      zoom={zoom}
      setZoom={setZoom}
      markerColor={markerColor ? markerColor : 'pink'}
      pickedPosition={pickedPosition}
      markerCaption={markerCaption}
      markerImage={markerImage}
      hideAddress={hideAddress}
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
      disabled={isLoading || !pickedPosition}
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
          {(latitude && longitude) && (
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
