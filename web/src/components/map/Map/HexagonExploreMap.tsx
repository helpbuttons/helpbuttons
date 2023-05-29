import React, { useEffect, useState } from 'react';
import { GeoJson, GeoJsonFeature, Overlay } from 'pigeon-maps';
import { store } from 'pages';
import { useRef } from 'store/Store';
import { updateCurrentButton } from 'state/Explore';
import { HbMap } from '.';
import {
  calculateDensityMap,
  convertBoundsToGeoJsonHexagons,
  getBoundsHexFeatures,
  getResolution,
} from 'shared/honeycomb.utils';
import _ from 'lodash';
import { useDebounce, useToggle } from 'shared/custom.hooks';
import { buttonTypes } from 'shared/buttonTypes';

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
  const [maxButtonsHexagon, setMaxButtonsHexagon] = useState(1);
  const [resolution, setResolution] = useState(1);
  const [boundsFeatures, setBoundsFeatures] = useState([]);
  const debouncedBoundsFeatures = useDebounce(boundsFeatures, 50);
  const [fetchingNewResolution, toggleFetchingNewResolution] =
    useToggle(false);

  const [h3ButtonsDensityFeatures, setH3ButtonsDensityFeatures] =
    useState([]);
  const onBoundsChanged = ({ center, zoom, bounds }) => {
    handleBoundsChange(bounds, center, zoom);
  };

  let cachedHexes = [];
  const handleMapClicked = ({ event, latLng, pixel }) => {
    setMapCenter(latLng);
    store.emit(new updateCurrentButton(null));
  };

  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );

  useEffect(() => {
    if (exploreSettings.loading) {
      return;
    }
    if (getResolution(exploreSettings.zoom) != resolution) {
      setResolution(() => getResolution(exploreSettings.zoom));
    }
    // setHexagonClicked(() => null); // unselect all hexagons

    if (exploreSettings.bounds) {
      setBoundsFeatures(() => {
        return getBoundsHexFeatures(
          exploreSettings.bounds,
          exploreSettings.zoom,
        );
      });
      toggleFetchingNewResolution(true);
      if (exploreSettings.zoom > exploreSettings.prevZoom) {
        // TODO: zooming in.. should not fetch from database..
        // this is not affecting the filtered buttons... so it won't update to new resolution.. how do it update resolution?
        // wont update filteredButtons, resolution will change
        // change hexagons to children
        const boundsHexes = convertBoundsToGeoJsonHexagons(
          exploreSettings.bounds,
          resolution,
        );
        setHexagonsToFetch({ resolution, hexagons: boundsHexes });
      } else if (exploreSettings.zoom < exploreSettings.prevZoom) {
        // zooming out..
        // request more buttons .. useEffect filteredButtons will create new density map!

        // getButtonsForBounds(exploreSettings.bounds)
        // will update filteredButtons, resolution will change
        const boundsHexes = convertBoundsToGeoJsonHexagons(
          exploreSettings.bounds,
          resolution,
        );
        setHexagonsToFetch({ resolution, hexagons: boundsHexes });
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
        setHexagonsToFetch({ resolution, hexagons: boundsHexes }); // hexagons missing
      }
    }
  }, [exploreSettings]);

  useEffect(() => {
    setH3ButtonsDensityFeatures(() => {
      if (!exploreSettings.bounds) {
        return [];
      }
      
      const densityMap = calculateDensityMap(filteredButtons, resolution)
      return _.unionBy(
        densityMap,
        debouncedBoundsFeatures,
        'properties.hex',
      );
    });
    toggleFetchingNewResolution(false);
  }, [resolution, filteredButtons]);

  useEffect(() => {
    console.log('resolutionfetching state: ' + fetchingNewResolution);
  }, [fetchingNewResolution]);
  useEffect(() => {
    setMaxButtonsHexagon(() =>
      h3ButtonsDensityFeatures.reduce((accumulator, currentValue) => {
        return Math.max(accumulator, currentValue.properties.count);
      }, maxButtonsHexagon),
    );
  }, [h3ButtonsDensityFeatures]);
  return (
    <>
      <HbMap
        mapCenter={exploreSettings.center}
        mapZoom={exploreSettings.zoom}
        onBoundsChanged={onBoundsChanged}
        handleMapClick={handleMapClicked}
        tileType={exploreSettings.tileType}
      >
        {selectedNetwork && (
          <Overlay anchor={[100, 100]}>
            <div className="search-map__network-title">
              {selectedNetwork.name}
              <div className="search-map__sign">
                made with{' '}
                <a href="https://helpbuttons.org">Helpbuttons</a>
              </div>
            </div>
          </Overlay>
        )}
        <GeoJson>
          {!fetchingNewResolution &&
            h3ButtonsDensityFeatures.map((buttonFeature) => (
              <GeoJsonFeature
                onClick={(feature) => {
                  setHexagonClicked(
                    () => feature.payload.properties.hex,
                  );
                }}
                feature={buttonFeature}
                key={buttonFeature.properties.hex}
                styleCallback={(feature, hover) => {
                  if (
                    feature.properties.hex == hexagonClicked &&
                    buttonFeature.properties.count > 0
                  ) {
                    return {
                      fill: 'white',
                      strokeWidth: '1',
                      stroke: '#18AAD2',
                      r: '20',
                      opacity: 0.8,
                    };
                  }
                  if (hover) {
                    return {
                      fill: 'white',
                      strokeWidth: '0.7',
                      stroke: '#18AAD2',
                      r: '20',
                      opacity: 0.7,
                    };
                  }
                  if (buttonFeature.properties.count < 1) {
                    return {
                      fill: 'transparent',
                      strokeWidth: '1',
                      stroke: '#18AAD2',
                      r: '20',
                      opacity:
                        0.2 +
                        (buttonFeature.properties.count * 50) /
                          (maxButtonsHexagon -
                            maxButtonsHexagon / 4) /
                          100,
                    };
                  }
                  return {
                    fill: '#18AAD2',
                    strokeWidth: '2',
                    stroke: '#18AAD2',
                    r: '20',
                    opacity:
                      0.2 +
                      (buttonFeature.properties.count * 50) /
                        (maxButtonsHexagon - maxButtonsHexagon / 4) /
                        100,
                  };
                }}
              />
            ))}
        </GeoJson>
        {!fetchingNewResolution &&
          h3ButtonsDensityFeatures.map((feature) => {
            if (
              feature.properties.count > 0 &&
              feature.properties.hex == hexagonClicked
            )
              return (
                <Overlay
                  anchor={feature.properties.center}
                  offset={[10, 20]}
                  key={feature.properties.hex}
                >
                  {buttonTypes.map((buttonType, idx) => {
                    return (
                      <span style={{ color: buttonType.cssColor }}>
                        <p>
                          {buttonType.caption}:{' '}
                          {feature.properties.count.toString()}
                        </p>
                      </span>
                    );
                  })}
                </Overlay>
              );
          })}
      </HbMap>
    </>
  );
}
