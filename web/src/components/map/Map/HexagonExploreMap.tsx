import React, { useEffect, useState, useRef } from 'react';
import { GeoJson, GeoJsonFeature, Overlay, Point } from 'pigeon-maps';
import { GlobalState, store, useGlobalStore } from 'state';
import {
  ExploreViewMode,
  RecenterExplore,
  UpdateExploreSettings,
  UpdateExploreViewMode,
  UpdateFiltersToFilterButtonType,
  UpdateHexagonClicked, updateCurrentButton,
} from 'state/Explore';
import { HbMap } from '.';
import {
  convertBoundsToGeoJsonPolygon,
  convertH3DensityToFeatures,
  getGeoJsonHexesForBounds,
  getZoomResolution} from 'shared/honeycomb.utils';
import _ from 'lodash';
import { buttonColorStyle, useButtonType } from 'shared/buttonTypes';
import Loading from 'components/loading';
import { IoContract, IoResize, IoStorefrontSharp } from 'react-icons/io5';
import { useStore } from 'state';
import { showMarkersZoom } from './Map.consts';
import { Button } from 'shared/entities/button.entity';
import { LocationKeyIcon, MarkerButton } from './MarkerButton';
import t from 'i18n';
import { circleGeoJSON } from 'shared/geo.utils';
import { h3SetToFeature } from 'geojson2h3';
import { cellToParent } from 'h3-js';
import { getCenter } from 'geolib';

export default function HexagonExploreMap({
  h3TypeDensityHexes,
  handleBoundsChange,
  exploreSettings,
  selectedNetwork,
  countFilteredButtons,
  keyLocations = []
}) {
  const [centerBounds, setCenterBounds] = useState<Point>(null);
  const [geoJsonFeatures, setGeoJsonFeatures] = useState([])
  const [resolution, setResolution] = useState(0)
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

   const viewMode = useStore(
    store,
    (state: GlobalState) => state.explore.settings.viewMode
  );

  const [hexagonsMedianCenters, setHexagonsMedianCenters] = useState([])
  const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)

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
    
    const zoomFloor = Math.floor(zoom);
    const newResolution = getZoomResolution(zoomFloor);
    if(resolution != newResolution){
      setResolution(() => newResolution)
    }
    handleBoundsChange(bounds, center, zoom)
    setCenterBounds(center);
  };

  const onMapClick = () => {
    store.emit(new UpdateHexagonClicked(null))
  };

  useEffect(() => {
    setGeoJsonFeatures(() => convertH3DensityToFeatures(h3TypeDensityHexes).filter((hex) => hex.properties.count > 0));
    setHexagonsMedianCenters(() => {
      return h3TypeDensityHexes.map((hex) => {
        const coordinates = hex.buttons.map((btn) => { return { latitude: btn.latitude, longitude: btn.longitude } })

        const medianCenterOfButtons = getCenter(coordinates)
        const center = medianCenterOfButtons ? [medianCenterOfButtons.latitude, medianCenterOfButtons.longitude] : hex.center

        return { center: center, groupByType: hex.groupByType ? hex.groupByType : [], count: hex.count, hexagon: hex.hexagon, buttons: hex.buttons }
      }).filter((h) => h.count > 0)
    })
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
      setHexagonClickedFeatures(() => hexagonsMedianCenters.find((feature) => feature.hexagon == hexagonClicked))
    } else if (hexagonHighlight) {
      setHexagonClickedFeatures(() => hexagonsMedianCenters.find((feature) => feature.hexagon == hexagonHighlight))
    }
  }, [hexagonHighlight, hexagonClicked, hexagonsMedianCenters])

  const filterButtonType = (btnTypeName) => {
    store.emit(new UpdateFiltersToFilterButtonType(btnTypeName))
  }
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
              {!(exploreSettings.zoom >= showMarkersZoom)  && geoJsonFeatures.map((hexagonFeature) => (
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
                        fill: 'transparent',
                        strokeWidth: '0',
                        stroke: '#18AAD2',
                        r: '20',
                        opacity: 0.1,
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
                      fill: 'transparent',
                      strokeWidth: '1',
                      stroke: '#18AAD2',
                      r: '20',
                      opacity: '0.1',
                    };
                  }}
                />
              ))}
            </GeoJson>
            {/*
            show count of buttons per hexagon
            */}
            {hexagonsMedianCenters && hexagonsMedianCenters.map((hexagonMedianCenter) => {
              return <Overlay
                anchor={hexagonMedianCenter.center}
                className="pigeon-map__custom-block"
                key={hexagonMedianCenter.hexagon}
              >
                <div
                  onClick={() =>
                    store.emit(
                      new UpdateHexagonClicked(
                        hexagonMedianCenter.hexagon,
                      ),
                    )
                  }
                  className="pigeon-map__hex-wrap"
                >
                  <span className="pigeon-map__hex-element">
                    <div className="pigeon-map__hex-info--unselect">
                      <div className="pigeon-map__hex-info--text-unselect">
                        {hexagonMedianCenter.count}
                      </div>
                    </div>
                  </span>
                </div>
              </Overlay>
            })}
              
             {keyLocations?.length > 0 && 
              keyLocations.map((place, idx) => {
                return (
                  <LocationKeyIcon
                    key={idx}
                    anchor={[place.latitude, place.longitude]}
                    offset={[35, 65]}
                    color={'white'}
                    title={place.address}
                    onClick={() => store.emit(new UpdateExploreSettings({zoom: place.zoom, center: [place.latitude, place.longitude]}))}
                  />
                );
              })
            }

            {/* draw clicked hexagon */}
            {!exploreSettings.loading &&
              hexagonClickedFeatures &&
              !(exploreSettings.zoom >= showMarkersZoom) && (
                <Overlay
                  anchor={hexagonClickedFeatures.center}
                  className="pigeon-map__custom-block"
                  key={hexagonClickedFeatures.hex}
                >
                  <div className="pigeon-map__hex-wrap pigeon-map__hex-wrap--selected">
                    {hexagonClickedFeatures.groupByType.map(
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
                              cursor: 'pointer',
                            }}
                            key={btnType.name}
                            onClick={() => filterButtonType(btnType.name)}
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
            {exploreSettings.zoom >= showMarkersZoom &&
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
            {/* draw go to center icon */}
            <Overlay
              anchor={[100, 100]}
              className="pigeon-center-buttons"
            >
              {viewMode == 'map' &&
                  <button
                    className="pigeon-full-map"                
                    onClick={() =>
                        store.emit(
                          new UpdateExploreViewMode(ExploreViewMode.BOTH),
                        )
                      }
                  >
                  
                  <IoContract />
                </button>
              }
              {viewMode != 'map' &&
                  <button
                    className="pigeon-full-map"                
                    onClick={() =>
                        store.emit(
                          new UpdateExploreViewMode(ExploreViewMode.MAP),
                        )
                      }
                  >
                  
                  <IoResize />
                </button>
              }
                <button
                  className="pigeon-center-view"
                  onClick={() => {
                    store.emit(new RecenterExplore());
                  }}
                >
                  <IoStorefrontSharp />
                </button>

              
            </Overlay>
             
            {(exploreSettings.loading) && (
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
          {t('explore.hiddenButtons', [countFilteredButtons])}
        </div>
      }
    </>
  );
}
