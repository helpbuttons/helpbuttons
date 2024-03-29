import React, { useEffect, useState, useRef } from 'react';
import { GeoJson, GeoJsonFeature, Overlay, Point } from 'pigeon-maps';
import { GlobalState, store } from 'pages';
import {
  HiglightHexagonFromButton,
  UpdateExploreSettings, UpdateHexagonClicked,
} from 'state/Explore';
import { HbMap } from '.';
import {
  convertH3DensityToFeatures,
} from 'shared/honeycomb.utils';
import _ from 'lodash';
import { buttonColorStyle, useButtonTypes } from 'shared/buttonTypes';
import Loading from 'components/loading';
import { IoStorefrontSharp } from 'react-icons/io5';
import { ShowMobileOnly } from 'elements/SizeOnly';
import { useStore } from 'store/Store';

export default function HexagonExploreMap({
  h3TypeDensityHexes,
  handleBoundsChange,
  exploreSettings,
  selectedNetwork,
}) {
  const [centerBounds, setCenterBounds] = useState<Point>(null);
  const [geoJsonFeatures, setGeoJsonFeatures] = useState([])

  const maxButtonsHexagon = useRef(1)
  const [isRedrawingMap, setIsRedrawingMap] = useState(true)

  const hexagonClicked = useStore(
    store,
    (state: GlobalState) => state.explore.settings.hexagonClicked
  );

  const hexagonHighlight = useStore(
    store,
    (state: GlobalState) => state.explore.settings.hexagonHighlight
  );

  const onBoundsChanged = ({ center, zoom, bounds }) => {
    setIsRedrawingMap(() => true)
    handleBoundsChange(bounds, center, zoom)

    setCenterBounds(center);
  };

  const onMapClick = () => {
    store.emit(new UpdateHexagonClicked(null))
  };

  useEffect(() => {
    setGeoJsonFeatures(() => convertH3DensityToFeatures(h3TypeDensityHexes).filter((hex) => hex.properties.count > 0));

    maxButtonsHexagon.current = h3TypeDensityHexes.reduce((accumulator, currentValue) => {
        return Math.max(accumulator, currentValue.count);
      }, 1);
    setIsRedrawingMap(() => false)

  }, [h3TypeDensityHexes]);

  const [buttonTypes, setButtonTypes] = useState([]);

  const [hexagonClickedFeatures, setHexagonClickedFeatures] = useState(null)
  useEffect(() => {
    if (!hexagonClicked)
    {
      setHexagonClickedFeatures(() => null)
    }else{
      setHexagonClickedFeatures(() => geoJsonFeatures.find((feature) => feature.properties.hex == hexagonClicked))
    }
    
  }, [hexagonClicked, geoJsonFeatures])

  useEffect(() => {
    if(!hexagonHighlight)
    {
      setHexagonClickedFeatures(() => null)
    }else{
      setHexagonClickedFeatures(() => geoJsonFeatures.find((feature) => feature.properties.hex == hexagonHighlight))
    }
  }, [hexagonHighlight])
  useButtonTypes(setButtonTypes);
  return (
    <>

    {exploreSettings.center && 
      <>
      <HbMap
        mapCenter={exploreSettings.center}
        mapZoom={exploreSettings.zoom}
        onBoundsChanged={onBoundsChanged}
        tileType={selectedNetwork.exploreSettings.tileType}
        handleClick={onMapClick}
      >
        <HbMapOverlay selectedNetwork={selectedNetwork}/>
        <GeoJson>
          {/* DRAW HEXAGONS ON MAP */}
        {geoJsonFeatures.map((hexagonFeature) => (
            <GeoJsonFeature
              // onMouseOver={() => {
              //   if(hexagonClicked != hexagonFeature.properties.hex)
              //   {
              //     store.emit(new UpdateHexagonClicked(hexagonFeature.properties.hex))
              //   }
              // }}
              onClick={(feature) => {
                if (hexagonFeature.properties.count > 0) {
                  store.emit(new UpdateHexagonClicked(hexagonFeature.properties.hex))
                } else {
                  store.emit(new UpdateHexagonClicked(null))
                }
              }}
              feature={hexagonFeature}
              key={hexagonFeature.properties.hex}
              styleCallback={(feature, hover) => {
                if (hover) {
                  return {
                    fill: '#18AAD2',
                    strokeWidth: '4',
                    stroke: '#18AAD2',
                    r: '20',
                    opacity: 0.8,
                  };
                }
                if (hexagonFeature.properties.count < 1) {
                  return {
                    fill: 'transparent',
                    strokeWidth: '1',
                    stroke: '#18AAD2',
                    r: '20',
                    opacity: 0.1,
                  };
                }
                return {
                  fill: '#18AAD2',
                  strokeWidth: '2',
                  stroke: '#18AAD2',
                  r: '20',
                  opacity:'0.4',
                    
                    // (hexagonFeature.properties.count * 30) /
                    //   (maxButtonsHexagon.current - maxButtonsHexagon.current / 7) /
                    //   100,
                };
              }}
            />
          ))}
          
          {/* DRAW CLICKED HEXAGON ON MAP */}
          {(!isRedrawingMap && hexagonClicked && hexagonClickedFeatures) && (
            <GeoJsonFeature
              feature={hexagonClickedFeatures}
              key={`clicked_${hexagonClicked}`}
              styleCallback={(feature, hover) => {
                return { fill: 'white' };
              }}
              onClick={() => {
                store.emit(new UpdateHexagonClicked(null))
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
                      store.emit(new UpdateHexagonClicked(hexagonFeature.properties.hex))
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

          {/* draw clicked hexagon */}
        {(!isRedrawingMap && hexagonClickedFeatures) && (
          <Overlay
            anchor={hexagonClickedFeatures.properties.center}
            offset={[20, 0]}
            className="pigeon-map__custom-block"
            key={hexagonClickedFeatures.properties.hex}
          >
            <div className="pigeon-map__hex-wrap pigeon-map__hex-wrap--selected">
              {hexagonClickedFeatures.properties.groupByType.map(
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

        {/* draw go to center icon */}
        <Overlay anchor={[100, 100]} className='pigeon-center-buttons'>
          <button className='pigeon-center-view' onClick={() => {      
            store.emit(
            new UpdateExploreSettings({
              center: selectedNetwork.exploreSettings.center,
              zoom: selectedNetwork.exploreSettings.zoom
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
      </>
      }
    </>
  );
}


function HbMapOverlay({ selectedNetwork }) {
  {
    /* DISPLAY INSTRUCTIONS OVER MAP*/
  }

  return (
    <ShowMobileOnly>
      <Overlay anchor={[100, 100]}>
        <div className="search-map__network-title">
          <div>{selectedNetwork.name}</div>
          <div className="search-map__sign">
            made with{' '}
            <a href="https://helpbuttons.org">Helpbuttons</a>
          </div>
        </div>
      </Overlay>
    </ShowMobileOnly>
  );
}
