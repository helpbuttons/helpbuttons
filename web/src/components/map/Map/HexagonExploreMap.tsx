import React, { useEffect, useState, useRef } from 'react';
import { GeoJson, GeoJsonFeature, Marker, Overlay, Point } from 'pigeon-maps';
import { GlobalState, store } from 'pages';
import {
  RecenterExplore,
  UpdateHexagonClicked, updateCurrentButton,
} from 'state/Explore';
import { HbMap } from '.';
import {
  convertH3DensityToFeatures, roundCoord,
} from 'shared/honeycomb.utils';
import _ from 'lodash';
import { buttonColorStyle, useButtonTypes } from 'shared/buttonTypes';
import Loading from 'components/loading';
import { IoAddCircle, IoStorefrontSharp } from 'react-icons/io5';
import { ShowMobileOnly } from 'elements/SizeOnly';
import { useStore } from 'store/Store';
import { maxZoom } from './Map.consts';
import { Button } from 'shared/entities/button.entity';
import { MarkerButton } from './MarkerButton';
import t from 'i18n';

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

  const boundsFilteredButtons: Button[] = useStore(
    store,
    (state: GlobalState) => state.explore.map.boundsFilteredButtons,
    false,
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

  const buttonTypes = selectedNetwork.buttonTemplates;

  const [hexagonClickedFeatures, setHexagonClickedFeatures] = useState(null)

  useEffect(() => {
    if(!hexagonHighlight && !hexagonClicked)
    {
      setHexagonClickedFeatures(() => null)
    }else if(hexagonClicked){
      setHexagonClickedFeatures(() => geoJsonFeatures.find((feature) => feature.properties.hex == hexagonClicked))
    }else if(hexagonHighlight){
      setHexagonClickedFeatures(() => geoJsonFeatures.find((feature) => feature.properties.hex == hexagonHighlight))
    }
  }, [hexagonHighlight,hexagonClicked, geoJsonFeatures])
  
  return (
    <>
      {exploreSettings.center && (
        <>
          <HbMap
            mapCenter={exploreSettings.center}
            mapZoom={exploreSettings.zoom}
            onBoundsChanged={onBoundsChanged}
            tileType={selectedNetwork.exploreSettings.tileType}
            handleClick={onMapClick}
          >
            <HbMapOverlay selectedNetwork={selectedNetwork} />
            <DisplayInstructions/>
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
                        store.emit(
                          new UpdateHexagonClicked(
                            hexagonFeature.properties.hex,
                          ),
                        );
                      } else {
                        store.emit(new UpdateHexagonClicked(null));
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
                      if (exploreSettings.zoom == maxZoom ) {
                        return {
                          fill: 'transparent',
                          strokeWidth: '5',
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
                        opacity: '0.4',

                        // (hexagonFeature.properties.count * 30) /
                        //   (maxButtonsHexagon.current - maxButtonsHexagon.current / 7) /
                        //   100,
                      };
                    }}
                  />
                ))}

                {/* DRAW CLICKED HEXAGON ON MAP */}
                {!isRedrawingMap &&
                  hexagonClicked &&
                  hexagonClickedFeatures && (
                    <GeoJsonFeature
                      feature={hexagonClickedFeatures}
                      key={`clicked_${hexagonClicked}`}
                      styleCallback={(feature, hover) => {
                        return {
                          fill: 'white',
                          opacity: '0.2',
                        };
                      }}
                      onClick={() => {
                        store.emit(new UpdateHexagonClicked(null));
                      }}
                    />
                  )}
              </GeoJson>
            {/*
        show count of buttons per hexagon
        */}
            {!isRedrawingMap &&
              !(exploreSettings.zoom == maxZoom) &&
              geoJsonFeatures.map((hexagonFeature) => {
                if (hexagonFeature.properties.count > 0) {
                  return (
                    <Overlay
                      anchor={hexagonFeature.properties.center}
                      offset={[30, 0]}
                      className="pigeon-map__custom-block"
                      key={hexagonFeature.properties.hex}
                    >
                      <div
                        onClick={() =>
                          store.emit(
                            new UpdateHexagonClicked(
                              hexagonFeature.properties.hex,
                            ),
                          )
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
            {!isRedrawingMap &&
              hexagonClickedFeatures &&
              !(exploreSettings.zoom == maxZoom) && (
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
                        if (!btnType) {
                          return <></>;
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
                              style={buttonColorStyle(
                                btnType.cssColor,
                              )}
                            >
                              <div className="pigeon-map__emoji pigeon-map__hex-info--icon">{btnType.icon}</div>
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
            {exploreSettings.zoom == maxZoom &&
              boundsFilteredButtons.map((button, idx) => {
                const btnType = buttonTypes.find((type) => {
                  return type.name == button.type;
                });
                if(button.hideAddress || !btnType) {
                  return (<></>)
                }
                return (
                  <MarkerButton
                    key={idx}
                    anchor={[button.latitude, button.longitude]}
                    offset={[35, 65]}
                    button={button}
                    handleMarkerClicked={() => store.emit(new updateCurrentButton(button))}
                    color={btnType.cssColor}
                  />
                );
              })}

            {/* draw go to center icon */}
            <Overlay
              anchor={[100, 100]}
              className="pigeon-center-buttons"
            >
              <button
                className="pigeon-center-view"
                onClick={() => {
                  store.emit( new RecenterExplore());
                }}
              >
                <IoStorefrontSharp />
              </button>
            </Overlay>
            {isRedrawingMap && (
              <Overlay anchor={centerBounds}>
                <Loading />
              </Overlay>
            )}
          </HbMap>
        </>
      )}
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


function DisplayInstructions() {
  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
    false,
  );
  const showInstructions = useStore(
    store,
    (state: GlobalState) => state.explore.map.showInstructions,
    false,
  );
  return (
    <>
      {(showInstructions && !loggedInUser ) && (
        <div className="search-map__instructions">
          {t('explore.displayInstructions')}
        </div>
      )}
    </>
  );
}
