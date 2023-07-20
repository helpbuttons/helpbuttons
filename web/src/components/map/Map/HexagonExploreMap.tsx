import React, { useEffect, useState } from 'react';
import { GeoJson, GeoJsonFeature, Overlay, Point } from 'pigeon-maps';
import { GlobalState, store } from 'pages';
import { useRef } from 'store/Store';
import { updateCurrentButton } from 'state/Explore';
import { HbMap } from '.';
import {
  convertBoundsToGeoJsonHexagons,
  convertH3DensityToFeatures,
  getBoundsHexFeatures,
  getResolution,
} from 'shared/honeycomb.utils';
import _ from 'lodash';
import { buttonColorStyle, buttonTypes } from 'shared/buttonTypes';
import Loading from 'components/loading';

export default function HexagonExploreMap({
  h3TypeDensityHexes,
  currentButton,
  handleBoundsChange,
  exploreSettings,
  setMapCenter,
  setHexagonsToFetch,
  setHexagonClicked,
  hexagonClicked,
  isRedrawingMap,
  filters,
}) {
  const [maxButtonsHexagon, setMaxButtonsHexagon] = useState(1);
  const [centerBounds, setCenterBounds] = useState<Point>(null);
  const [geoJsonFeatures, setGeoJsonFeatures] = useState([]);

  const onBoundsChanged = ({ center, zoom, bounds }) => {
    handleBoundsChange(bounds, center, zoom);
    setCenterBounds(center);
  };

  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );

  useEffect(() => {
    if (exploreSettings.loading) {
      return;
    }

    setHexagonClicked(() => null); // unselect all hexagons

    if (exploreSettings.bounds) {
      const boundsHexes = convertBoundsToGeoJsonHexagons(
        exploreSettings.bounds,
        getResolution(exploreSettings.zoom),
      );
      setHexagonsToFetch({
        resolution: getResolution(exploreSettings.zoom),
        hexagons: boundsHexes,
      });
    }
  }, [exploreSettings]);

  useEffect(() => {
    setGeoJsonFeatures(() => {
      return convertH3DensityToFeatures(h3TypeDensityHexes);
    });
    setMaxButtonsHexagon(() =>
      h3TypeDensityHexes.reduce((accumulator, currentValue) => {
        return Math.max(accumulator, currentValue.count);
      }, maxButtonsHexagon),
    );
  }, [h3TypeDensityHexes]);

  return (
    <>
      <HbMap
        mapCenter={exploreSettings.center}
        mapZoom={exploreSettings.zoom}
        onBoundsChanged={onBoundsChanged}
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
          {geoJsonFeatures.map((hexagonFeature) => (
            <GeoJsonFeature
              onClick={(feature) => {
                if (hexagonFeature.properties.count > 0) {
                  console.log(feature.payload);
                  setHexagonClicked(() => feature.payload);
                }
              }}
              feature={hexagonFeature}
              key={hexagonFeature.properties.hex}
              styleCallback={(feature, hover) => {
                if (hover) {
                  return {
                    fill: 'white',
                    strokeWidth: '0.7',
                    stroke: '#18AAD2',
                    r: '20',
                    opacity: 0.7,
                  };
                }
                if (hexagonFeature.properties.count < 0) {
                  return {
                    fill: 'red',
                    strokeWidth: '1',
                    stroke: '#18AAD2',
                    r: '20',
                    opacity: 0.2,
                  };
                }
                if (hexagonFeature.properties.count < 1) {
                  return {
                    fill: 'transparent',
                    strokeWidth: '1',
                    stroke: '#18AAD2',
                    r: '20',
                    opacity:
                      0.2 +
                      (hexagonFeature.properties.count * 50) /
                        (maxButtonsHexagon - maxButtonsHexagon / 4) /
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
                    (hexagonFeature.properties.count * 50) /
                      (maxButtonsHexagon - maxButtonsHexagon / 4) /
                      100,
                };
              }}
            />
          ))}
          {!isRedrawingMap && hexagonClicked && (
            <GeoJsonFeature
              feature={hexagonClicked}
              key={`clicked_${hexagonClicked.properties.hex}`}
              styleCallback={(feature, hover) => {
                return { fill: 'white' };
              }}
              onClick={() => {
                setHexagonClicked(() => null);
              }}
            />
          )}
        </GeoJson>
        {/*
        show count of buttons per hexagon
        */}
        {!isRedrawingMap &&
          geoJsonFeatures.map((hexagonFeature) => {
            if (
              hexagonFeature.properties.hex !==
                hexagonClicked?.properties.hex &&
              hexagonFeature.properties.count > 0
            ) {
              return (
                <Overlay
                  anchor={hexagonFeature.properties.center}
                  offset={[30, 0]}
                  className="pigeon-map__custom-block"
                  key={hexagonFeature.properties.hex}
                >
                  <div
                    onClick={() =>
                      setHexagonClicked(() => hexagonFeature)
                    }
                    className="pigeon-map__hex-wrap"
                  >
                    <span className="pigeon-map__hex-element">
                      <div className="pigeon-map__hex-info--unselect">
                        <div className="pigeon-map__hex-info--text-unselect">
                          {hexagonFeature.properties.count}
                        </div>
                      </div>
                    </span>
                  </div>
                </Overlay>
              );
            }
          })}
        {!isRedrawingMap && hexagonClicked && (
          <Overlay
            anchor={hexagonClicked.properties.center}
            offset={[20, 0]}
            className="pigeon-map__custom-block"
            key={hexagonClicked.properties.hex}
          >
            <div className="pigeon-map__hex-wrap">
              {hexagonClicked.properties.groupByType.map(
                (hexagonBtnType, idx) => {
                  if (hexagonBtnType.count < 1) {
                    return;
                  }
                  const btnType = buttonTypes.find((type) => {
                    return type.name == hexagonBtnType.type;
                  });
                  return (
                    <span
                      className="pigeon-map__hex-element"
                      style={{
                        color: btnType.cssColor,
                        fontWeight: 'bold',
                      }}
                      key={btnType.name}
                    >
                      <div
                        className="pigeon-map__hex-info"
                        key={idx}
                        style={buttonColorStyle(btnType.cssColor)}
                      >
                        <div className="btn-filter__icon pigeon-map__hex-info--icon"></div>
                        <div className="pigeon-map__hex-info--text">
                          {hexagonBtnType.count.toString()}
                        </div>
                      </div>
                    </span>
                  );
                },
              )}
            </div>
          </Overlay>
        )}
        {isRedrawingMap && (
          <Overlay anchor={centerBounds}>
            <Loading />
          </Overlay>
        )}
      </HbMap>
    </>
  );
}
