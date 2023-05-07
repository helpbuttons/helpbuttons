import React, { useEffect, useState } from 'react';
import { GeoJson, Point } from 'pigeon-maps';
import { Button } from 'shared/entities/button.entity';
import { MarkerButton, MarkerButtonPopup } from './MarkerButton';
import { store } from 'pages';
import {
  updateCurrentButton,
} from 'state/Explore';
import { HbMap } from '.';
import { featuresToGeoJson, getGeoJsonHexesForBounds, getGeoJsonHexesPolygonsForButtons, getResolution } from 'shared/honeycomb.utils';

export default function HexagonExploreMap({
  filteredButtons,
  currentButton,
  handleBoundsChange,
  mapZoom,
  mapCenter,
  setMapZoom,
  setMapCenter,
}) {
  const [boundsFeatures, setBoundsFeatures] = useState([]);

  const onBoundsChanged = ({ center, zoom, bounds }) => {
    const newGeoJsonHexesBounds = getGeoJsonHexesForBounds(bounds,getResolution(zoom));
    if(newGeoJsonHexesBounds.length > 500)
    {
      try {
        throw new Error('Too many features, throwing for safety');
    } catch(e) {
        console.log(e.stack);
        return;
    }
    }
    setBoundsFeatures(newGeoJsonHexesBounds);

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

  return (
    <HbMap
      mapCenter={mapCenter}
      setMapCenter={setMapCenter}
      mapZoom={mapZoom}
      setMapZoom={setMapZoom}
      handleBoundsChange={onBoundsChanged}
      handleMapClick={handleMapClicked}
    >
      
      {filteredButtons.map((button: Button, idx) => (
        // here draw hexagons depending on the buttons!
        // <GeoJson data=getGeoJsonHexesPolygonsForButtons(filteredButtons, getResolution(zoom))
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
      <GeoJson
              data={featuresToGeoJson(boundsFeatures)}
              onClick={(feature) => {console.log(feature.payload.properties.hex)}}
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
            {true && 
              <GeoJson
              data={featuresToGeoJson(getGeoJsonHexesPolygonsForButtons(['863944607ffffff','88394461dbfffff'], getResolution(mapZoom)))}
              onClick={(feature) => {console.log(feature.payload)}}
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
                  fill: 'black',
                  opacity: 0.5,
                  strokeWidth: '0.3',
                  stroke: '#ffdd02ff',
                  r: '20',
                };
              }}
            />
              }
    </HbMap>
  );
}
