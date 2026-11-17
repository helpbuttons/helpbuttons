import React, { useEffect, useState, useRef } from 'react';
import { GeoJson, GeoJsonFeature, GeoJsonLoader, Overlay, Point } from 'pigeon-maps';
import { GlobalState, store, useGlobalStore } from 'state';
import {
  ExploreViewMode,
  HoverButtonList,
  RecenterExplore,
  UpdateExploreSettings,
  UpdateExploreViewMode,
  UpdateFiltersHexButtonType,
  UpdateHexagonClicked, updateCurrentButton,
} from 'state/Explore';
import { HbMap } from '.';
import {
  cellToZoom,
  convertH3DensityToFeatures,
  getZoomResolution
} from 'shared/honeycomb.utils';
import _ from 'lodash';
import { buttonColorStyle } from 'shared/buttonTypes';
import Loading from 'components/loading';
import { IoContract, IoResize, IoStorefrontSharp } from 'react-icons/io5';
import { useStore } from 'state';
import { showMarkersZoom } from './Map.consts';
import { LocationKeyIcon } from './MarkerButton';
import t from 'i18n';
import { circleGeoJSON } from 'shared/geo.utils';
import { getCenter } from 'geolib';
import { useIsMobile } from 'elements/SizeOnly';
import { isPointInBounds } from 'elements/Fields/FieldLocation/location.helpers';
import { UpdateProvinceButtonTypeClicked, UpdateProvinceClicked } from 'state/ExploreProvince';
import { provincesH3GeoJson, provincesMaxZoom, provincesPolygonsGeoJson } from './Provinces.consts';

export default function HexagonExploreMap({
  h3TypeDensityHexes,
  handleBoundsChange,
  exploreSettings,
  selectedNetwork,
  countFilteredButtons,
  keyLocations = [],
  boundsHexagons = [],
  buttonsPerProvince = [],
}) {
  const [centerBounds, setCenterBounds] = useState<Point>(null);
  const [geoJsonFeatures, setGeoJsonFeatures] = useState([])
  const [resolution, setResolution] = useState(0)
  const [keyLocationsInBounds, setKeyLocationsInBounds] = useState([])
  const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)

  const hexagonClicked = useStore(
    store,
    (state: GlobalState) => state.explore.map.filters.hexClicked
  );
  const provinceClicked = useStore(
    store,
    (state: GlobalState) => state.explore.map.filters.provinceClicked
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

    setKeyLocationsInBounds(() => keyLocations.filter((_kl) => isPointInBounds([_kl.latitude, _kl.longitude], bounds)))
  };

  const onMapClick = () => {
    store.emit(new UpdateHexagonClicked(null))
    store.emit(new updateCurrentButton(null))
    store.emit(new HoverButtonList(null))
    store.emit(new UpdateProvinceClicked(null))
  };

  useEffect(() => {
    setGeoJsonFeatures(() => convertH3DensityToFeatures(h3TypeDensityHexes).filter((hex) => hex.properties.count > 0));
  }, [h3TypeDensityHexes]);

  useEffect(() => {
    setHexagonsMedianCenters(() => {
      return h3TypeDensityHexes.map((hex) => {
        let btns = hex.buttons
        if(exploreSettings.zoom > showMarkersZoom){
          btns = btns.filter((btn) => !btn.hideAddress)
        }
        const coordinates = btns.map((btn) => { 
          if(btn.hideAddress){
            return { latitude: btn.latitude, longitude: btn.longitude } 
          }
          return { latitude: btn.latitude, longitude: btn.longitude } 
        })

        const medianCenterOfButtons = getCenter(coordinates)
        const center = medianCenterOfButtons ? [medianCenterOfButtons.latitude, medianCenterOfButtons.longitude] : hex.center
        return { center: center, groupByType: hex.groupByType ? hex.groupByType : [], count: btns.length, hexagon: hex.hexagon, buttons: btns }
      })
      .filter((h) => h.count > 0)
    })
  }, [h3TypeDensityHexes, exploreSettings.zoom])
  const buttonTypes = selectedNetwork.buttonTemplates;
  const [hexagonClickedFeatures, setHexagonClickedFeatures] = useState(null)
  useEffect(() => {
    if (!hoverButtonList && !hexagonClicked && !currentButton) {
      setHexagonClickedFeatures(() => null)
    } else if (hexagonClicked && !currentButton) {
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
  
  const filterButtonType = (hexagonSelected, btnTypeName) => {
    store.emit(new UpdateFiltersHexButtonType(hexagonSelected, btnTypeName))
  }

  const [provinceClickedPolygon, setProvinceClickedPolygon] = useState(null)
  useEffect(() => {
    if(exploreSettings.zoom > provincesMaxZoom)
    {
      setProvinceClickedPolygon(() => null)
      store.emit(new UpdateProvinceClicked(null))
      return;
    }
  }, [boundsHexagons, resolution])

  useEffect(() => {
    if(!provinceClicked){
      setProvinceClickedPolygon(() => null)
    }else{
      setProvinceClickedPolygon(() => provincesH3GeoJson.find((prov) => prov.code == provinceClicked)?.polygon)
    }
  }, [provinceClicked])

  const showProvinces = exploreSettings.zoom <= provincesMaxZoom;
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
            <DisplayHiddenButtonsWarning countFilteredButtons={countFilteredButtons} />
            <GeoJson>
            {filteredCircle && <GeoJsonFeature feature={filteredCircle}/>}
            </GeoJson>
            {showProvinces && 
              <GeoJson>
                {provincesPolygonsGeoJson.features.map((provincePolygon) => {
                  return (<GeoJsonFeature svgAttributes={{fill: `${provincePolygon.properties.Codigo}${provincePolygon.properties.Cod_CCAA}` != provinceClicked ? "#d4e6ec99" : 'black',strokeWidth: "1",stroke: "white",r: "20"}} onClick={() => {store.emit(new UpdateProvinceClicked(`${provincePolygon.properties.Codigo}${provincePolygon.properties.Cod_CCAA}`));console.log(provincePolygon.properties.Texto)}} feature={provincePolygon}/>)
                })}
              </GeoJson>
            }
            {showProvinces && buttonsPerProvince.map((p, idx) => {
              return (
                <Overlay
                anchor={[p.centroid.geometry.coordinates[1], p.centroid.geometry.coordinates[0]]}
                className="pigeon-map__custom-block"
                key={idx}
              >
                {provinceClicked && p.code == provinceClicked && <MapGroupedType typesGrouped={p.grouped} buttonTypes={buttonTypes} onTypeClicked={(btnTypeName) => store.emit(new UpdateProvinceButtonTypeClicked(btnTypeName))}/>}
                {p.code != provinceClicked && (<>{`${p.name} ${p.count}`}</>)}
                
              </Overlay>
            )
            })}
            {/*
            show count of buttons per hexagon
            */}
            {!showProvinces && hexagonsMedianCenters && hexagonsMedianCenters.filter((feat) => feat.count > 1 && hexagonClickedFeatures?.hexagon != feat.hexagon).map((hexagonMedianCenter) => {
              return <Overlay
                anchor={hexagonMedianCenter.center}
                className="pigeon-map__custom-block"
                key={hexagonMedianCenter.hexagon}
              >
                <MapCircleButtonsCount hexagonCenter={hexagonMedianCenter}/>
              </Overlay>
            })}

            {!showProvinces && hexagonsMedianCenters && hexagonsMedianCenters.filter((feat) => feat.count == 1).map((hexagonMedianCenter,idx) => {
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
                  <MapGroupedType typesGrouped={hexagonClickedFeatures.groupByType} buttonTypes={buttonTypes} onTypeClicked={(buttonTypeName) => {
                    filterButtonType(hexagonClickedFeatures.hexagon, buttonTypeName)
                  }}/>
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
  return (<MapCircleNumber caption={hexagonCenter.count} onClick={() =>
    store.emit(
      new UpdateHexagonClicked(
        hexagonCenter.hexagon,
      ),
    )}/>)
}

function MapCircleNumber({ caption, onClick = () => {}}) {
  return (
    <div
      onClick={onClick}
      className="pigeon-map__hex-wrap"
    >
      <span className="pigeon-map__hex-element">
        <div className="pigeon-map__hex-info--unselect">
          <div className="pigeon-map__hex-info--text-unselect">
            {caption}
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
  if(!btnType.icon){
    return <div onClick={handleClick} className={`${button.id == currentButton?.id || hoverButtonList?.id == button.id ? 'pigeon-map__hex-element--emoji-selected' : ''}  pigeon-map__emoji`}>
    1
  </div>
  }
  return (
    <div onClick={handleClick} className={`${button.id == currentButton?.id || hoverButtonList?.id == button.id ? 'pigeon-map__hex-element--emoji-selected' : ''}  pigeon-map__emoji`}>
      {btnType.icon}
    </div>
  )
}

function MapGroupedType({ typesGrouped, buttonTypes, onTypeClicked = (btnTypeName) => {} }) {

  const displayButtonsTypes = buttonTypes.map((_btnType) => {
    const findType = typesGrouped.find((_tGrouped) => _tGrouped.type == _btnType.name)
    return { ..._btnType, count: findType?.count }
  }).filter((_b) => _b.count > 0)


  return (
    <>
      <div className="pigeon-map__hex-wrap pigeon-map__hex-wrap--selected">
        {displayButtonsTypes.map((btnType, idx) => {
          return (
            <span
              className="pigeon-map__hex-element--selected"
              style={{
                color: btnType.cssColor,
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              key={btnType.name}
              onClick={() => onTypeClicked(btnType.name)}
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
                  {/* {JSON.stringify(btnType)} */}
                  {btnType.count}
                  {/* {hexagonBtnType.count.toString()} */}
                </div>
              </div>
            </span>)
        })}
      </div>
    </>
  )
}