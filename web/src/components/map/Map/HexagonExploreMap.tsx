import React, { useEffect, useState, useRef } from 'react';
import { GeoJson, GeoJsonFeature, Overlay, Point } from 'pigeon-maps';
import { GlobalState, store, useGlobalStore } from 'state';
import {
  ExploreViewMode,
  HoverButtonList,
  RecenterExplore,
  UpdateExploreSettings,
  UpdateExploreViewMode,
  UpdateFiltersToFilterButtonType,
  UpdateHexagonClicked, updateCurrentButton,
} from 'state/Explore';
import { HbMap } from '.';
import {
  cellToZoom,
  convertH3DensityToFeatures,
  getZoomResolution} from 'shared/honeycomb.utils';
import _ from 'lodash';
import { buttonColorStyle, useButtonType } from 'shared/buttonTypes';
import Loading from 'components/loading';
import { IoContract, IoResize, IoStorefrontSharp } from 'react-icons/io5';
import { useStore } from 'state';
import { showMarkersZoom } from './Map.consts';
import { LocationKeyIcon } from './MarkerButton';
import t from 'i18n';
import { circleGeoJSON } from 'shared/geo.utils';
import { getCenter } from 'geolib';
import { isMobile, useIsMobile } from 'elements/SizeOnly';

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

  const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)

  const hexagonClicked = useStore(
    store,
    (state: GlobalState) => state.explore.settings.hexagonClicked
  );

  const hoverButtonList = useStore(
    store,
    (state: GlobalState) => state.explore.settings.hoverButton
  );

  const filtersByLocation = useGlobalStore(
    (state: GlobalState) => state.explore.map.filters.where
  );

   const viewMode = useStore(
    store,
    (state: GlobalState) => state.explore.settings.viewMode
  );

  const [hexagonsMedianCenters, setHexagonsMedianCenters] = useState([])

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
      // setHexagonsMedianCenters(() => [])
    }
    handleBoundsChange(bounds, center, zoom)
    setCenterBounds(center);
  };

  const onMapClick = () => {
    store.emit(new UpdateHexagonClicked(null))
    store.emit(new updateCurrentButton(null))
    store.emit(new HoverButtonList(null))
  };

  useEffect(() => {
    setGeoJsonFeatures(() => convertH3DensityToFeatures(h3TypeDensityHexes).filter((hex) => hex.properties.count > 0));
    maxButtonsHexagon.current = h3TypeDensityHexes.reduce((accumulator, currentValue) => {
      return Math.max(accumulator, currentValue.count);
    }, 1);
  }, [h3TypeDensityHexes]);

  useEffect(() => {
    setHexagonsMedianCenters(() => {
      return h3TypeDensityHexes.map((hex) => {
        let btns = hex.buttons
        if(exploreSettings.zoom > showMarkersZoom){
          btns = btns.filter((btn) => !btn.hideAddress)
        }
        const coordinates = btns.map((btn) => { return { latitude: btn.latitude, longitude: btn.longitude } })

        const medianCenterOfButtons = getCenter(coordinates)
        const center = medianCenterOfButtons ? [medianCenterOfButtons.latitude, medianCenterOfButtons.longitude] : hex.center
        return { center: center, groupByType: hex.groupByType ? hex.groupByType : [], count: btns.length, hexagon: hex.hexagon, buttons: btns }
      }).filter((h) => h.count > 0)
    })
  }, [h3TypeDensityHexes, exploreSettings.zoom])
  const buttonTypes = selectedNetwork.buttonTemplates;
  const [hexagonClickedFeatures, setHexagonClickedFeatures] = useState(null)
  useEffect(() => {
    if (!hoverButtonList && !hexagonClicked && !currentButton) {
      setHexagonClickedFeatures(() => null)
    } else if (hexagonClicked) {
      setHexagonClickedFeatures(() => hexagonsMedianCenters.find((feature) => feature.hexagon == hexagonClicked))
    } else if(currentButton) {
      const highLightHexagon = cellToZoom(currentButton.hexagon, exploreSettings.zoom)
      setHexagonClickedFeatures(() =>
        hexagonsMedianCenters.find((feature) => feature.hexagon == highLightHexagon))    
    } else if (hoverButtonList) {
      const highLightHexagon = cellToZoom(hoverButtonList.hexagon, exploreSettings.zoom)
      setHexagonClickedFeatures(() =>
      hexagonsMedianCenters.find((feature) => feature.hexagon == highLightHexagon))
    }
  }, [hoverButtonList, hexagonClicked, hexagonsMedianCenters, currentButton, exploreSettings.zoom])
  
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

            </GeoJson>
            {/*
            show count of buttons per hexagon
            */}
            {hexagonsMedianCenters && hexagonsMedianCenters.filter((feat) => feat.count > 1 && hexagonClickedFeatures?.hexagon != feat.hexagon).map((hexagonMedianCenter) => {
              return <Overlay
                anchor={hexagonMedianCenter.center}
                className="pigeon-map__custom-block"
                key={hexagonMedianCenter.hexagon}
              >
                <MapCircleButtonsCount hexagonCenter={hexagonMedianCenter}/>
              </Overlay>
            })}

            {hexagonsMedianCenters && hexagonsMedianCenters.filter((feat) => feat.count == 1).map((hexagonMedianCenter,idx) => {
              return (
                <Overlay
                  anchor={hexagonMedianCenter.center}
                  className="pigeon-map__custom-block"
                  key={idx}
                >
                  <MapButtonIcon button={hexagonMedianCenter.buttons[0]} buttonTypes={buttonTypes}/>
                  </Overlay>
              );
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
              hexagonClickedFeatures && hexagonClickedFeatures.count > 1 && (
                <Overlay
                  anchor={hexagonClickedFeatures.center}
                  className="pigeon-map__custom-block"
                  key={hexagonClickedFeatures.hex}
                >
                  <MapSelectedHexagon hexagonClickedFeatures={hexagonClickedFeatures} buttonTypes={buttonTypes} filterButtonType={filterButtonType}/>
                </Overlay>
              )}
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

function MapCircleButtonsCount({ hexagonCenter}) {
  return (
    <div
      onClick={() =>
        store.emit(
          new UpdateHexagonClicked(
            hexagonCenter.hexagon,
          ),
        )
      }
      className="pigeon-map__hex-wrap"
    >
      <span className="pigeon-map__hex-element">
        <div className="pigeon-map__hex-info--unselect">
          <div className="pigeon-map__hex-info--text-unselect">
            {hexagonCenter.count}
          </div>
        </div>
      </span>
    </div>
  )
}

function MapButtonIcon({ button, buttonTypes }) {
  const hoverButtonList = useStore(
    store,
    (state: GlobalState) => state.explore.settings.hoverButton
  );
  const zoom = useStore(
    store,
    (state: GlobalState) => state.explore.settings.zoom
  );
  const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)

  const btnType = buttonTypes.find((type) => {
    return type.name == button.type;
  });
  const isMobile = useIsMobile()
  const handleClick = () => {
    if(isMobile)
    {
      const clickedHexagon = cellToZoom(button.hexagon, zoom)
      store.emit(new UpdateHexagonClicked(clickedHexagon))
      store.emit(
        new HoverButtonList(
          button
        ),
      )
    }else{
      store.emit(new updateCurrentButton(button))
    }
    
  }
  return (
    <div onClick={handleClick} className={`${button.id == currentButton?.id || hoverButtonList?.id == button.id ? 'pigeon-map__hex-element--emoji-selected' : ''}  pigeon-map__emoji`}>
      {btnType.icon}
    </div>
  )
}

function MapSelectedHexagon({ hexagonClickedFeatures, buttonTypes, filterButtonType }) {
  return (
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
  )
}