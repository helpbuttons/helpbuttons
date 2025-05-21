import React, { useEffect, useState, useRef } from 'react';
import { GeoJson, GeoJsonFeature, Marker, Overlay, Point } from 'pigeon-maps';
import { GlobalState, store, useGlobalStore } from 'state';
import {
  RecenterExplore,
  UpdateHexagonClicked, updateCurrentButton,
} from 'state/Explore';
import { HbMap } from '.';
import {
  convertH3DensityToFeatures,
  getZoomResolution} from 'shared/honeycomb.utils';
import _ from 'lodash';
import { buttonColorStyle, useButtonType } from 'shared/buttonTypes';
import Loading from 'components/loading';
import { IoStorefrontSharp } from 'react-icons/io5';
import { ShowMobileOnly } from 'elements/SizeOnly';
import { useStore } from 'state';
import { showMarkersZoom } from './Map.consts';
import { Button } from 'shared/entities/button.entity';
import { MarkerButton } from './MarkerButton';
import t from 'i18n';
import { PoweredBy } from 'components/brand/powered';
import { circleGeoJSON } from 'shared/geo.utils';
import dconsole from 'shared/debugger';
import { h3SetToFeature } from 'geojson2h3';
import { cellToParent } from 'h3-js';

export default function HexagonExploreMap({
  h3TypeDensityHexes,
  handleBoundsChange,
  exploreSettings,
  selectedNetwork,
  countFilteredButtons
}) {
  const [centerBounds, setCenterBounds] = useState<Point>(null);
  const [geoJsonFeatures, setGeoJsonFeatures] = useState([])
  const [currentButtonHexagon, setCurrentButtonHexagon] = useState(null)

  const maxButtonsHexagon = useRef(1)

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

  const filtersByLocation = useGlobalStore(
    (state: GlobalState) => state.explore.map.filters.where
  );

  const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)

  useEffect(() => {
    if(currentButton && currentButton.hideAddress)
    {
      const hexagon = cellToParent(currentButton.hexagon, getZoomResolution(exploreSettings.zoom))
      
      setCurrentButtonHexagon(() => h3SetToFeature([hexagon]))
    }else{
      setCurrentButtonHexagon(() => null)
    }
  }, [currentButton, exploreSettings.zoom])

  const [filteredCircle, setFilteredCircle] = useState(null)
  useEffect(() => {
    if(filtersByLocation?.center && filtersByLocation?.radius)
    {
      setFilteredCircle(() => circleGeoJSON(filtersByLocation.center[1],filtersByLocation.center[0], filtersByLocation.radius*0.001));
    }else{
      setFilteredCircle(() => null)
    }
  }, [filtersByLocation])
  const onBoundsChanged = ({ center, zoom, bounds }) => {
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
  }, [h3TypeDensityHexes]);

  const buttonTypes = selectedNetwork.buttonTemplates;
  const currentButtonType = useButtonType(currentButton, buttonTypes);
  const [hexagonClickedFeatures, setHexagonClickedFeatures] = useState(null)
  useEffect(() => {
    if (!hexagonHighlight && !hexagonClicked) {
      setHexagonClickedFeatures(() => null)
    } else if (hexagonClicked) {
      setHexagonClickedFeatures(() => geoJsonFeatures.find((feature) => feature.properties.hex == hexagonClicked))
    } else if (hexagonHighlight) {
      setHexagonClickedFeatures(() => geoJsonFeatures.find((feature) => feature.properties.hex == hexagonHighlight))
    }
  }, [hexagonHighlight, hexagonClicked, geoJsonFeatures])

  return (
    <>
      {(exploreSettings.center && selectedNetwork) && (
        <>
          <HbMap
            mapCenter={exploreSettings.center}
            mapZoom={exploreSettings.zoom}
            onBoundsChanged={onBoundsChanged}
            tileType={selectedNetwork.exploreSettings.tileType}
            handleClick={onMapClick}
          >
            <DisplayInstructions />
            <DisplayHiddenButtonsWarning countFilteredButtons={countFilteredButtons} />
            <GeoJson>
              
            {filteredCircle && <GeoJsonFeature feature={filteredCircle}/>}
            
              {/* DRAW HEXAGONS ON MAP */}
              {!(exploreSettings.zoom >= showMarkersZoom)  && !currentButton && geoJsonFeatures.map((hexagonFeature) => (
                <GeoJsonFeature
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
                    if (exploreSettings.zoom >= showMarkersZoom) {
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
                    };
                  }}
                />
              ))}

              {/* DRAW CLICKED HEXAGON ON MAP */}
              {!exploreSettings.loading &&
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
                {currentButtonHexagon &&
                  <GeoJsonFeature
                    feature={currentButtonHexagon}
                    key={`currentButtonHexagon}`}
                    styleCallback={(feature, hover) => {
                      return {
                        fill: '#18AAD2',
                        opacity: '0.4',
                      };
                    }}
                  />
                }
            </GeoJson>
            {/*
        show count of buttons per hexagon
        */}
            {!exploreSettings.loading &&
            !currentButton &&
              !(exploreSettings.zoom >= showMarkersZoom) &&
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
            {!exploreSettings.loading &&
             !currentButton &&
              hexagonClickedFeatures &&
              !(exploreSettings.zoom >= showMarkersZoom) && (
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
                            className="pigeon-map__hex-element--selected"
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
            {!currentButton && exploreSettings.zoom >= showMarkersZoom &&
              boundsFilteredButtons.filter(button => { return button.hideAddress ? false : button }).map((button, idx) => {
                const btnType = buttonTypes.find((type) => {
                  return type.name == button.type;
                });
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
            {(currentButton && !currentButton.hideAddress) &&
              <MarkerButton
                anchor={[currentButton.latitude, currentButton.longitude]}
                offset={[35, 65]}
                button={currentButton}
                handleMarkerClicked={() => {}}
                color={currentButtonType.cssColor}
              />
            }
            {/* draw go to center icon */}
            <Overlay
              anchor={[100, 100]}
              className="pigeon-center-buttons"
            >
              <button
                className="pigeon-center-view"
                onClick={() => {
                  store.emit(new RecenterExplore());
                }}
              >
                <IoStorefrontSharp />
              </button>
            </Overlay>
            {exploreSettings.loading && (
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



function DisplayInstructions() {
  const sessionUser = useStore(
    store,
    (state: GlobalState) => state.sessionUser,
    false,
  );
  const showInstructions = useStore(
    store,
    (state: GlobalState) => state.explore.map.showInstructions,
    false,
  );
  return (
    <>
      {(showInstructions && !sessionUser) && (
        <div className="search-map__instructions">
          {t('explore.displayInstructions')}
        </div>
      )}
    </>
  );
}


function DisplayHiddenButtonsWarning({ countFilteredButtons }) {
  return (
    <>
      {countFilteredButtons > 0 &&
        <div className="search-map__hidden-buttons-warning">
          {t('explore.hiddenButtons')}
        </div>
      }
    </>
  );
}
