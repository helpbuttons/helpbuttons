import React, { useEffect, useState } from 'react';
import { GeoJson, Overlay } from 'pigeon-maps';
import { Button } from 'shared/entities/button.entity';
import { MarkerButton, MarkerButtonPopup } from './MarkerButton';
import { store } from 'pages';
import {
  updateCurrentButton,
} from 'state/Explore';
import { HbMap } from '.';
import { convertH3DensityToFeatures, featuresToGeoJson, getGeoJsonHexesForBounds, getResolution } from 'shared/honeycomb.utils';
import { cellToParent } from 'h3-js';
import _ from 'lodash';

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
  const [h3ButtonsDensityFeatures, setH3ButtonsDensityFeatures] = useState([])
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

  useEffect(() => {
    const hexagonsOnResolution = filteredButtons.map((button) => cellToParent(button.hexagon, getResolution(mapZoom)))
    setH3ButtonsDensityFeatures(convertH3DensityToFeatures(_.groupBy(hexagonsOnResolution)))
  }, [filteredButtons])
  return (
    <HbMap
      mapCenter={mapCenter}
      setMapCenter={setMapCenter}
      mapZoom={mapZoom}
      setMapZoom={setMapZoom}
      handleBoundsChange={onBoundsChanged}
      handleMapClick={handleMapClicked}
    >
      
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
              <GeoJson
              data={featuresToGeoJson(h3ButtonsDensityFeatures)}
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
            {h3ButtonsDensityFeatures.map((feature) => {
              return (
              <Overlay anchor={feature.properties.center}>
                {feature.properties.count}
             </Overlay>
              )
            })}
             
    </HbMap>
  );
}
