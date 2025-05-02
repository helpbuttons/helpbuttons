import React, { useEffect, useState } from 'react';
import { GeoJson, Point } from 'pigeon-maps';
import { Button } from 'shared/entities/button.entity';
import { MarkerButton, MarkerButtonPopup } from './MarkerButton';
import { GlobalState, store } from 'state';
import { updateCurrentButton } from 'state/Explore';
import { HbMap } from '.';
import { BrowseType } from './Map.consts';
import { featuresToGeoJson, getBoundsHexFeatures } from 'shared/honeycomb.utils';
import dconsole from 'shared/debugger';
const SCROLL_PIXELS_FOR_ZOOM_LEVEL = 150;

export default function ExploreMap({
  filteredButtons,
  currentButton,
  handleBoundsChange,
  exploreSettings,
  setMapCenter,
}) {
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    handleBoundsChange(bounds, center, zoom);
  };

  const handleMarkerClicked = (button: Button) => {
    setMapCenter([button.latitude, button.longitude]);
    store.emit(new updateCurrentButton(button));
  };
  const handleMapClicked = ({ event, latLng, pixel }) => {
    setMapCenter(latLng);
    store.emit(new updateCurrentButton(null));
  };

  const [honeyCombFeatures, setHoneyCombFeatures] = useState(() => 
  {return {
    bounds: featuresToGeoJson([]),
    buttonsDensity: featuresToGeoJson([])
  }})
  useEffect(() => {
    if (exploreSettings.browseType == BrowseType.HONEYCOMB && exploreSettings.bounds) {
      setHoneyCombFeatures(() => {
        return {
        bounds: getBoundsHexFeatures(exploreSettings.bounds, exploreSettings.zoom),
        buttonsDensity: null
      }})
    }
  },[exploreSettings])
  
  return (
    <>
      <HbMap
        mapCenter={exploreSettings.center}
        mapZoom={exploreSettings.zoom}
        onBoundsChanged={onBoundsChanged}
        handleMapClick={handleMapClicked}
        tileType={
          exploreSettings.tileType
        }
      >
        
        {(exploreSettings.browseType == BrowseType.HONEYCOMB ) && (
            <GeoJson
              data={honeyCombFeatures.bounds}
              onClick={(feature) => {
                dconsole.log(feature.payload.properties.hex);
              }}
              styleCallback={(feature, hover) => {
                if (hover) {
                  return {
                    fill: '#ffdd028c',
                    strokeWidth: '0.3',
                    stroke: '#ffdd02ff',
                    r: '20',
                  };
                }
                return {
                  fill: '#d4e6ec11',
                  strokeWidth: '0.3',
                  stroke: '#ffdd02ff',
                  r: '20',
                };
              }}
            />
        )}

        {(exploreSettings.browseType == BrowseType.PINS ) && 
          filteredButtons.map((button: Button, idx) => (
          <MarkerButton
            key={idx}
            anchor={[button.latitude, button.longitude]}
            offset={[35, 65]}
            button={button}
            handleMarkerClicked={handleMarkerClicked}
            currentButtonId={currentButton?.id}
          />
        ))}

        {currentButton && (
          <MarkerButtonPopup
            anchor={[currentButton.latitude, currentButton.longitude]}
            offset={[155, 328]}
            button={currentButton}
          />
        )}
      </HbMap>
    </>
  );
}
