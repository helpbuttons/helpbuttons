import React, { useEffect, useState } from 'react';
import { getDistance } from 'geolib';

import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import t from 'i18n';

import { NetworkMapConfigure } from 'components/map/Map/NetworkMapConfigure';
import { BrowseType, HbMapTiles, maxZoom, minZoom } from 'components/map/Map/Map.consts';
import { getBoundsHexFeatures, roundCoord, roundCoords } from 'shared/honeycomb.utils';
import PickerField from 'components/picker/PickerField';
import { IoSearchOutline } from 'react-icons/io5';
import dconsole from 'shared/debugger';
import Slider from 'rc-slider';
import LocationSearchBar, { LocationSearchBarSimple } from 'elements/LocationSearchBar';
import { useGeoReverse } from '../FieldLocation/location.helpers';
import { circleGeoJSON } from 'shared/geo.utils';


export default function FieldAreaMap({
  validationError,
  onChange,
  marker,
  label,
  explain,
  markerColor = 'pink',
  value
}) {
  const [showPopup, setShowPopup] =  useState(false)

  const closePopup = () => setShowPopup(() => false)
  const openPopup = () => setShowPopup(() => true)

  const labelPicker = value?.zoom ? t('configuration.areaPicked',[roundCoord(value.center[0]),roundCoord(value.center[1]),value.zoom]) : label
  return (
      <PickerField   iconLink ={<IoSearchOutline/>}    showPopup={showPopup} validationError={validationError} label={label} btnLabel={labelPicker} explain={explain} headerText={t('picker.headerText')} openPopup={openPopup} closePopup={closePopup}>
        <FieldAreaMapSettings
            defaultExploreSettings={value}
            onChange={onChange}
            marker={marker}
            closePopup={closePopup}
          />
      </PickerField>
  )
}


export function FieldAreaMapSettings({
  defaultExploreSettings,
  onChange,
  marker,
  markerColor = 'pink',
  closePopup = () => {dconsole.log('defailtt yyy')}
}) {

  const [mapSettings, setMapSettings] = useState(() => {
    return {...{
      center: [0,0],
      zoom: 4,
      tileType: HbMapTiles.OSM,
      radius: 10000,
      bounds: null,
      slider:  {
        min: 1000,
        max: 3000,
        step: 100,
        onChange: (newRadius) => setRadius(newRadius)
      },
      geometry: circleGeoJSON(0,0, 10000),
      browseType: BrowseType.HONEYCOMB,
      honeyCombFeatures: null,
    }, ...defaultExploreSettings}
  })
  const getSliderSettings = (mapZoom, bounds) => {
    const boundsDistanceInMeters = getDistance({latitude: bounds.ne[0], longitude:bounds.ne[1] }, {latitude: bounds.sw[0], longitude:bounds.sw[1] })
        
    return {
      min: 100,
      max: Math.floor(boundsDistanceInMeters / 2),
      step: 100,
      radius: mapSettings.radius,
      onChange: (newRadius) => setRadius(newRadius)
    }
  }

  
  const setZoom = (newZoom) => {
    setMapSettings((prevSettings) => {return {...prevSettings, zoom: newZoom}})
  }
  const setCenter = (newCenter) => {
    setMapSettings((prevSettings) => {
      return {...prevSettings, center: newCenter}
    })
  };

  const setRadius = (newRadius) => {
    setMapSettings((prevSettings) => {return {...prevSettings, radius: newRadius, geometry: circleGeoJSON(prevSettings.center[1],prevSettings.center[0], newRadius)}})
  }

  const setMapTile = (mapTile) => {
    setMapSettings((prevSettings) => {return {...prevSettings, tileType: mapTile}})
  }

  const setBrowseType = (browseType) => {
    setMapSettings((prevSettings) => {return {...prevSettings, browseType}})
  }

  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    setMapSettings((prevSettings) => {
      if(prevSettings.browseType == BrowseType.HONEYCOMB)
      {
        return {...prevSettings, center, zoom: zoom, slider: getSliderSettings(zoom, bounds), geometry: circleGeoJSON(center[1],center[0], prevSettings.radius), bounds: bounds, honeyCombFeatures: getBoundsHexFeatures(bounds,zoom)}
      }
      return {...prevSettings, center, zoom: zoom, slider: getSliderSettings(zoom, bounds), geometry: circleGeoJSON(center[1],center[0], prevSettings.radius), bounds: bounds}
    })
  }

  const handleSelectedPlace = (place) => {
    setMapSettings((prevSettings) => {
      return {...prevSettings, center: [place.geometry.lat, place.geometry.lng], zoom:16,geometry: circleGeoJSON(place.geometry.lat, place.geometry.lng, prevSettings.radius)}
    })
  };
  const handleMapClick = ({latLng}) => {
    findAddressFromPosition(latLng, false)
    setMapSettings((prevSettings) => {
      return {...prevSettings, center: latLng, geometry: circleGeoJSON(latLng[1],latLng[0], prevSettings.radius * 0.001)}
    })
  }

  const [address, setAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const getLatLngAddress = useGeoReverse()
  const findAddressFromPosition = (latLng, hideAddress) => {
    setIsLoading(() => true)
    getLatLngAddress(latLng, hideAddress, (place) => {
      setAddress(() => place.formatted)
      setIsLoading(() => false)
    },
      (error) => {
        setIsLoading(() => false)
        setAddress(() => t('button.unknownPlace'))
      }
    );
  }
  
  useEffect(() => {
    onChange({zoom: mapSettings.zoom, center: mapSettings.center, radius: mapSettings.radius, tileType: mapSettings.tileType, browseType: mapSettings.browseType})
  }, [mapSettings])
return (
  <div className="form__field form__field--location-wrapper">
  
              <LocationSearchBar
                placeholder={t('button.locationPlaceholder')}
                pickedAddress={address}
                hideAddress={true}
                setPickedAddress={setAddress}
                isCustomAddress={null}
                setIsCustomAddress={() => {}}
                setPickedPosition={setCenter}
                focusPoint={mapSettings.center}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                pickedPosition={mapSettings.center}
                explain={t('configuration.centerOfMap')}
              />

              <NetworkMapConfigure
                mapSettings={mapSettings}
                onBoundsChanged={onBoundsChanged}
                handleMapClick={handleMapClick}
                setMapTile={setMapTile}
                marker={marker}
                setBrowseType={setBrowseType}
                tileType={mapSettings.tileType}
                markerColor={markerColor}
              />
               <div className="form__field">
                <div className="form__explain">{t('configuration.zoomLevel')}</div>
                <div className="form__input--slider">

                <Slider
                  min={minZoom}
                  max={maxZoom}
                  onChange={(newZoom) => {
                    setZoom(newZoom)
                    dconsole.log('change zoom in the map')
                  }}
                  value={mapSettings.zoom}
                />
                </div>

                {mapSettings.zoom}
              </div>

              <Btn
                btnType={BtnType.submit}
                caption={t('common.save')}
                contentAlignment={ContentAlignment.center}
                onClick={() => closePopup()}
              />
              </div>
)
}
