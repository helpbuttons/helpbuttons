//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';
import { getDistance } from 'geolib';

import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import t from 'i18n';

import { NetworkMapConfigure } from 'components/map/Map/NetworkMapConfigure';
import { BrowseType, HbMapTiles } from 'components/map/Map/Map.consts';
import { circleToPolygon } from 'shared/geo.utils';
import { getBoundsHexFeatures, roundCoords } from 'shared/honeycomb.utils';
import PickerField from 'components/picker/PickerField';

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
  return (
    <PickerField showPopup={showPopup} validationError={validationError} label={label} btnLabel={label} explain={explain} headerText={t('picker.headerText')} openPopup={openPopup} closePopup={closePopup}>
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
  closePopup = () => {console.log('defailtt yyy')}
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
      geometry: circleToPolygon([0,0], 10000),
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



  const setRadius = (newRadius) => {
    setMapSettings((prevSettings) => {return {...prevSettings, radius: newRadius, geometry: circleToPolygon([prevSettings.center[1],prevSettings.center[0]], newRadius)}})
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
        return {...prevSettings, center, zoom: zoom, slider: getSliderSettings(zoom, bounds), geometry: circleToPolygon(roundCoords([center[1],center[0]]), prevSettings.radius), bounds: bounds, honeyCombFeatures: getBoundsHexFeatures(bounds,zoom)}
      }
      return {...prevSettings, center, zoom: zoom, slider: getSliderSettings(zoom, bounds), geometry: circleToPolygon(roundCoords([center[1],center[0]]), prevSettings.radius), bounds: bounds}
    })
  }

  const handleSelectedPlace = (place) => {
    setMapSettings((prevSettings) => {
      return {...prevSettings, center: [place.geometry.lat, place.geometry.lng], zoom:16,geometry: circleToPolygon([place.geometry.lat, place.geometry.lng], prevSettings.radius)}
    })
  };
  const handleMapClick = ({latLng}) => {
    setMapSettings((prevSettings) => {
      return {...prevSettings, center: latLng, geometry: circleToPolygon(latLng, prevSettings.radius)}
    })
  }

  useEffect(() => {
    onChange({zoom: mapSettings.zoom, center: mapSettings.center, radius: mapSettings.radius, tileType: mapSettings.tileType, browseType: mapSettings.browseType})
  }, [mapSettings])
return (
  <>
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
              {/* <DropDownSearchLocation
                placeholder={t('homeinfo.searchlocation')}
                handleSelectedPlace={handleSelectedPlace}
              /> */}
              <Btn
                btnType={BtnType.submit}
                caption={t('common.save')}
                contentAlignment={ContentAlignment.center}
                onClick={() => closePopup()}
              />
              </>
)
}
