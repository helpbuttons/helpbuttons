import React, { useEffect, useState } from 'react';
import {
  Bounds,
  GeoJson,
  GeoJsonFeature,
  Overlay,
} from 'pigeon-maps';
import { Button } from 'shared/entities/button.entity';
import { MarkerButton, MarkerButtonPopup } from './MarkerButton';
import { store } from 'pages';
import { updateCurrentButton } from 'state/Explore';
import { HbMap } from '.';
import {
  convertBoundsToGeoJsonHexagons,
  convertH3DensityToFeatures,
  featuresToGeoJson,
  getBoundsHexFeatures,
  getResolution,
} from 'shared/honeycomb.utils';
import { cellToParent } from 'h3-js';
import _ from 'lodash';
import { usePrevious } from 'shared/custom.hooks';
import { filter } from 'rxjs';

export default function HexagonExploreMap({
  filteredButtons,
  currentButton,
  handleBoundsChange,
  exploreSettings,
  setMapCenter,
  setHexagonsToFetch,
  setHexagonClicked,
  hexagonClicked,
}) {

  const [maxButtonsHexagon, setMaxButtonsHexagon] = useState(0);
  const [resolution, setResolution] = useState(1);
  const [h3ButtonsDensityFeatures, setH3ButtonsDensityFeatures] =
    useState([]);
  const onBoundsChanged = ({ center, zoom, bounds }) => {
    handleBoundsChange(bounds, center, zoom);
  };

  let cachedHexes = [];

  const handleMarkerClicked = (button: Button) => {
    setMapCenter([button.latitude, button.longitude]);
    store.emit(new updateCurrentButton(button));
  };
  const handleMapClicked = ({ event, latLng, pixel }) => {
    setMapCenter(latLng);
    store.emit(new updateCurrentButton(null));
  };

  useEffect(() => {
    if (exploreSettings.loading) {
      return;
    }
    if (getResolution(exploreSettings.zoom) != resolution) {
      setResolution(() => getResolution(exploreSettings.zoom));
    }
    setHexagonClicked(() => null); // unselect all hexagons

    if (exploreSettings.bounds) {

      if (exploreSettings.prevZoom == 0) {
        console.log('im loading... ');
      } else if (exploreSettings.zoom > exploreSettings.prevZoom) {
        // TODO: zooming in.. should not fetch from database.. 
        // this is not affecting the filtered buttons... so it won't update to new resolution.. how do it update resolution?
        // wont update filteredButtons, resolution will change
        // change hexagons to children
        const boundsHexes = convertBoundsToGeoJsonHexagons(
          exploreSettings.bounds,
          resolution,
        );
        setHexagonsToFetch({resolution,hexagons: boundsHexes});
      } else if (exploreSettings.zoom < exploreSettings.prevZoom) {
        // zooming out.. 
        // request more buttons .. useEffect filteredButtons will create new density map!

        // getButtonsForBounds(exploreSettings.bounds)
        // will update filteredButtons, resolution will change
        const boundsHexes = convertBoundsToGeoJsonHexagons(
          exploreSettings.bounds,
          resolution,
        );
        setHexagonsToFetch({resolution,hexagons: boundsHexes}); 
        // TODO: for new hexagons... subtract already cache hexagons
      } else {
        // panning, 
        // TODO should only fetch new hexagons.
        // will update filteredButtons, but resolution won't change, where do I draw the hexagons?
        // getButtonsForBounds(exploreSettings.bounds)
        const boundsHexes = convertBoundsToGeoJsonHexagons(
          exploreSettings.bounds,
          resolution,
        );
        cachedHexes = _.union(boundsHexes, cachedHexes);
        setHexagonsToFetch({resolution,hexagons: boundsHexes}); // hexagons missing
      }
    }
  }, [exploreSettings]);

  useEffect(() => {
    
    
    setH3ButtonsDensityFeatures(() => {
      if(!exploreSettings.bounds)
      {
        return []
      }
      const boundsFeatures = getBoundsHexFeatures(
        exploreSettings.bounds,
        exploreSettings.zoom,
      )
      const hexagonsOnResolution = filteredButtons.map((button) =>
        cellToParent(button.hexagon, resolution),
      );
      const densityMap = convertH3DensityToFeatures(
        _.groupBy(hexagonsOnResolution),
      );
      return _.unionBy(
        densityMap,
        boundsFeatures,
        'properties.hex',
      );
    });
  }, [resolution, filteredButtons]);

  useEffect(() => {
    setMaxButtonsHexagon(() =>
      h3ButtonsDensityFeatures.reduce((accumulator, currentValue) => {
        return Math.max(accumulator, currentValue.properties.count);
      }, 1),
    );
  }, [h3ButtonsDensityFeatures]);
  return (
    <>
      Found : {filteredButtons.length} zoom: {exploreSettings.zoom}{' '}
      resolution: {resolution} - max: {maxButtonsHexagon}
      <HbMap
        mapCenter={exploreSettings.center}
        mapZoom={exploreSettings.zoom}
        onBoundsChanged={onBoundsChanged}
        handleMapClick={handleMapClicked}
        tileType={exploreSettings.tileType}
      >
        <GeoJson>
          {h3ButtonsDensityFeatures.map((buttonFeature) => (
            <GeoJsonFeature
              onClick={(feature) => {
                setHexagonClicked(
                  () => feature.payload.properties.hex,
                );
              }}
              feature={buttonFeature}
              key={buttonFeature.properties.hex}
              styleCallback={(feature, hover) => {
                if (feature.properties.hex == hexagonClicked) {
                  return {
                    fill: 'red',
                    strokeWidth: '0.3',
                    stroke: 'red',
                    r: '20',
                    opacity: 1,
                  };
                }
                if (hover) {
                  return {
                    fill: '#ffdd02e0',
                    strokeWidth: '1.5',
                    stroke: 'black',
                    r: '20',
                  };
                }
                return {
                  fill: '#ffdd02e0',
                  strokeWidth: '1',
                  stroke: 'grey',
                  r: '20',
                  opacity:
                    (buttonFeature.properties.count * 100) /
                    (maxButtonsHexagon - maxButtonsHexagon / 4) /
                    100,
                };
              }}
            />
          ))}
        </GeoJson>
        {h3ButtonsDensityFeatures.map((feature) => {
          if (feature.properties.count > 0)
            return (
              <Overlay
                anchor={feature.properties.center}
                key={feature.properties.hex}
              >
                {feature.properties.count.toString()}
              </Overlay>
            );
        })}
      </HbMap>
    </>
  );
}
