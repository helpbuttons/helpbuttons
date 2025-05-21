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
import { markerFocusZoom, showMarkersZoom } from 'components/map/Map/Map.consts';
import { useGeoReverse } from './location.helpers';
import { IoLocation, IoLocationOutline, IoLocationSharp, IoSearchOutline } from 'react-icons/io5';
import LocationSearchBar from 'elements/LocationSearchBar';
import dconsole from 'shared/debugger';
import { useRouter } from 'next/router';


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
  markerPosition
}) {
  const [pickedPosition, setPickedPosition] = useState(markerPosition)

  const [zoom, setZoom] = useState(selectedNetwork.exploreSettings.zoom);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [pickedAddress, setPickedAddress] = useState(markerAddress)

  const closeWithoutSaving = () => {

    setPickedAddress(() => markerAddress)
    setPickedPosition(() => markerPosition)
    setShowPopup(() => false)
  }
  const closeAndSave = () => {
    if (!isCustomAddress && hideAddress) {
      getLatLngAddress(pickedPosition, true, (place) => {
        const address = place.formatted;
        setMarkerAddress(address)
        setLatitude(pickedPosition[0])
        setLongitude(pickedPosition[1])
        setShowPopup(() => false)
      },
        (error) => {
          const address = t('button.unknownPlace')
          setMarkerAddress(address)
          setLatitude(pickedPosition[0])
          setLongitude(pickedPosition[1])
          setShowPopup(() => false)
        }
      );
    } else {
      setMarkerAddress(pickedAddress)
      setLatitude(pickedPosition[0])
      setLongitude(pickedPosition[1])
      setShowPopup(() => false)
    }

  }
  const openPopup = () => setShowPopup(() => true)

  const onMapClick = (latLng) => {
    setPickedPosition(() => latLng)
    if (!isCustomAddress) {
      findAddressFromPosition(latLng)
    }
  }

  const getLatLngAddress = useGeoReverse()
  const findAddressFromPosition = (latLng) => {

    setIsLoading(() => true)
    if (latLng[0] && latLng[1]) {
      getLatLngAddress(latLng, false, (place) => {
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

  useQueryLocation((latLng, _zoom) => {
    getLatLngAddress(latLng, false, (place) => {
      const address = place.formatted;
      setMarkerAddress(address)
      setLatitude(latLng[0])
      setLongitude(latLng[1])
      setPickedAddress(() => address)
      setPickedPosition(() => roundCoords(latLng))
      setZoom(() => Number(_zoom))
      setIsLoading(() => false)
    },
    (error) => {
      const address = t('button.unknownPlace')
      setMarkerAddress(address)
      setLatitude(latLng[0])
      setLongitude(latLng[1])
      setPickedPosition(() => latLng)
      setZoom(() => markerFocusZoom)
      setIsLoading(() => false)
    })
  })

  return <PickerField
    iconLink={<IoLocationOutline />}
    showPopup={showPopup}
    validationError={validationError}
    label={t('button.whereLabel')}
    btnLabel={
      pickedPosition ? <LocationCoordinates
        latitude={pickedPosition[0]}
        longitude={pickedPosition[1]}
        address={markerAddress}
        label={label}
      /> : t('button.whereLabel')
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
      focusPoint={pickedPosition}
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


const useQueryLocation = (saveLocation) => {
  const router = useRouter();
  const { lat, lng, zoom } = router.query;
  useEffect(() => {
    if(lat && lng)
    {
      saveLocation([lat,lng], zoom)
    }
  }, [router])
  
}