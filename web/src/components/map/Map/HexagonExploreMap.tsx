import React, { useEffect, useState } from 'react';
import { GeoJson, GeoJsonFeature, Overlay, Point } from 'pigeon-maps';
import { GlobalState, store } from 'pages';
import { useRef } from 'store/Store';
import {
  SetExploreSettingsBoundsLoaded,
  UpdateExploreSettings,
} from 'state/Explore';
import { HbMap } from '.';
import {
  convertBoundsToGeoJsonHexagons,
  convertH3DensityToFeatures,
  getBoundsHexFeatures,
  getResolution,
} from 'shared/honeycomb.utils';
import _ from 'lodash';
import { buttonColorStyle, useButtonTypes } from 'shared/buttonTypes';
import Loading from 'components/loading';
import { IoStorefrontSharp } from 'react-icons/io5';

export default function HexagonExploreMap({
  h3TypeDensityHexes,
  currentButton,
  handleBoundsChange,
  exploreSettings,
  setHexagonsToFetch,
  setHexagonClicked,
  hexagonClicked,
  isRedrawingMap,
  selectedNetwork,
}) {
  const [maxButtonsHexagon, setMaxButtonsHexagon] = useState(1);
  const [centerBounds, setCenterBounds] = useState<Point>(null);
  const [geoJsonFeatures, setGeoJsonFeatures] = useState([]);
  const onBoundsChanged = ({ center, zoom, bounds }) => {
    handleBoundsChange(bounds, center, zoom)

    setCenterBounds(center);
  };

  useEffect(() => {
    setGeoJsonFeatures(() => {
      return convertH3DensityToFeatures(h3TypeDensityHexes);
    });
    setMaxButtonsHexagon(() =>
      h3TypeDensityHexes.reduce((accumulator, currentValue) => {
        return Math.max(accumulator, currentValue.count);
      }, 1),
    );
  }, [h3TypeDensityHexes]);

  const [buttonTypes, setButtonTypes] = useState([]);
  useButtonTypes(setButtonTypes);

  return (
    <>
    {exploreSettings.center && 
      <HbMap
        mapCenter={exploreSettings.center}
        mapZoom={exploreSettings.zoom}
        onBoundsChanged={onBoundsChanged}
        tileType={selectedNetwork.exploreSettings.tileType}
      >
        <Overlay anchor={[100, 100]}>
          <div className="search-map__network-title">
            <div>{selectedNetwork.name}</div>
            <div className="search-map__sign">
              made with{' '}
              <a href="https://helpbuttons.org">Helpbuttons</a>
            </div>
            
          </div>

        </Overlay>

        <GeoJson>
          {geoJsonFeatures.map((hexagonFeature) => (
            <GeoJsonFeature
              onClick={(feature) => {
                if (hexagonFeature.properties.count > 0) {
                  setHexagonClicked(() => feature.payload);
                } else {
                  setHexagonClicked(() => 'unset');
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
                if (hexagonFeature.properties.count < 1) {
                  return {
                    fill: 'transparent',
                    strokeWidth: '1',
                    stroke: '#18AAD2',
                    r: '20',
                    opacity: 0.2,
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
                setHexagonClicked(() => 'unset');
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
            <div className="pigeon-map__hex-wrap pigeon-map__hex-wrap--selected">
              {hexagonClicked.properties.groupByType.map(
                (hexagonBtnType, idx) => {
                  if (hexagonBtnType.count < 1) {
                    return;
                  }
                  const btnType = buttonTypes.find((type) => {
                    return type.name == hexagonBtnType.type;
                  });
                  if(!btnType)
                  {
                    return <></>
                  }
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
        <Overlay anchor={[100, 100]} className='pigeon-center-buttons'>
          <button className='pigeon-center-view' onClick={() => {      
            store.emit(
            new UpdateExploreSettings({
              center: selectedNetwork.exploreSettings.center
            }));
          }}>
            <IoStorefrontSharp/>
          </button>
        </Overlay>
        {isRedrawingMap && (
          <Overlay anchor={centerBounds}>
            <Loading />
          </Overlay>
        )}
      </HbMap>
      }
    </>
  );
}
