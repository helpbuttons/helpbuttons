//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';
import { getDistance } from 'geolib';

import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import t from 'i18n';
import { NetworkEditMap } from 'components/map/Map/NetworkEditMap';
import { HbMapTiles } from 'components/map/Map/TileProviders';
import circleToPolygon from 'circle-to-polygon';


export default function FieldAreaMap({
  validationError,
  selectedNetwork,
  onChange,
}) {

  const [mapSettings, setMapSettings] = useState(() => {
    return {
      center: [0,0],
      zoom: 3,
      tileType: HbMapTiles.OSM,
      radius: 10000,
      slider:  {
        min: 1000,
        max: 3000,
        step: 100,
        onChange: (newRadius) => setRadius(newRadius)
      },
      geometry: circleToPolygon([0,0], 10000),
      marker:{
        caption: '',
        image: 'fail.png'
      }
    }
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

  
  const [showHideMenu, setHideMenu] = useState(false);

  const setRadius = (newRadius) => {
    setMapSettings((prevSettings) => {return {...prevSettings, radius: newRadius, geometry: circleToPolygon([prevSettings.center[1],prevSettings.center[0]], newRadius)}})
  }

  const setMapTile = (mapTile) => {
    setMapSettings((prevSettings) => {return {...prevSettings, tileType: mapTile}})
  }

  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    setMapSettings((prevSettings) => {
      return {...prevSettings, center, zoom, slider: getSliderSettings(zoom, bounds), geometry: circleToPolygon([center[1],center[0]], prevSettings.radius)}
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
    onChange({zoom: mapSettings.zoom, center: mapSettings.center, radius: mapSettings.radius, tileType: mapSettings.tileType})
  }, [mapSettings])
  

  useEffect(() => {
    if(mapSettings.center[0] == 0)
    {
      setMapSettings((prevSettings) => {
        return {...prevSettings, center: [selectedNetwork.latitude, selectedNetwork.longitude], zoom: selectedNetwork.zoom, tileType: selectedNetwork.tiletype, radius: selectedNetwork.radius, marker:{caption: selectedNetwork.name, image: selectedNetwork.logo }}
      })
    }
    
  }, [selectedNetwork])

  return (
    <>
      <div className="form__field">
        <div
          className="btn"
          onClick={() => setHideMenu(!showHideMenu)}
        >
          {t('button.changePlace')}
        </div>
      </div>
      {showHideMenu && (
        <div className="picker__close-container">
          <div className="picker--over picker-box-shadow picker__content picker__options-v">
            <NetworkEditMap
              mapSettings={mapSettings}
              onBoundsChanged={onBoundsChanged}
              handleMapClick={handleMapClick}
              setMapTile={setMapTile}
            />
            <DropDownSearchLocation
              placeholder={t('homeinfo.searchlocation')}
              handleSelectedPlace={handleSelectedPlace}
            />
            <Btn
              btnType={BtnType.splitIcon}
              caption={t('common.save')}
              contentAlignment={ContentAlignment.center}
              onClick={() => setHideMenu(!showHideMenu)}
            />
          </div>

          <div
            className="picker__close-overlay"
            onClick={() => setHideMenu(false)}
          ></div>
        </div>
      )}
      <span style={{ color: 'red' }}>{validationError}</span>
    </>
  );
}
