import React, { useEffect, useRef, useState } from 'react';
import { HbMapUncontrolled } from '.';
import {
  getZoomResolution,
  latLngToGeoJson,
} from 'shared/honeycomb.utils';
import { LocationKeyIcon, MarkerButtonIcon } from './MarkerButton';
import { LoadabledComponent } from 'components/loading';
import {
  HbMapTiles,
  hexagonSizeZoom,
} from './Map.consts';
import { useSelectedNetwork } from 'state/Networks';
import { GeoJsonLoader, Marker } from 'pigeon-maps';
import { GlobalState, useGlobalStore } from 'state';
import { Role } from 'shared/types/roles';
export function MarkerEditorMap({
  pickedPosition,
  zoom,
  setZoom = (a) => { },
  markerColor,
  markerImage,
  markerCaption,
  hideAddress = false,
  editPosition = false,
  onMapClick = (latLng) => { },
  networkMapCenter = null,
  isLocationKeyMarker = false,
}) {
  const selectedNetwork = useSelectedNetwork()
  const [markerHexagonGeoJson, setMarkerHexagonGeoJson] =
    useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const mapCenterIsReady = useRef(false);
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    setZoom(() => zoom);
    setMapCenter(() => center);
  };

  useEffect(() => {
    if (
      editPosition &&
      mapCenterIsReady.current &&
      pickedPosition &&
      pickedPosition[0] &&
      pickedPosition[1]
    ) {
      setMapCenter(() => pickedPosition);
    }
  }, [pickedPosition]);

  function handleMapClicked({ latLng }) {
    onMapClick(latLng);
  }
  useEffect(() => {
    if (mapCenterIsReady.current) {
        setMarkerHexagonGeoJson(() => null);
    } else if (pickedPosition && pickedPosition[0] && pickedPosition[1]) {
      setMapCenter(() => pickedPosition);
    } else if (
      networkMapCenter &&
      networkMapCenter[0] &&
      networkMapCenter[1]
    ) {
      mapCenterIsReady.current = true;
      setMapCenter(() => networkMapCenter);
    }
  }, [hideAddress, pickedPosition, networkMapCenter]);

  return (
    <>
      <div className="picker__map">
        <LoadabledComponent loading={!mapCenter}>
          <HbMapUncontrolled
            mapCenter={mapCenter}
            mapZoom={zoom}
            onBoundsChanged={onBoundsChanged}
            handleMapClick={handleMapClicked}
            height={'18'}
            tileType={selectedNetwork.exploreSettings.tileType}
          >
            {isLocationKeyMarker && 
              <LocationKeyIcon title={markerCaption} anchor={pickedPosition}
              offset={[25, 50]}
              cssColor={'red'}
              zoom={zoom}/>
            }
            {(!isLocationKeyMarker && pickedPosition) && (
              <MarkerButtonIcon
                anchor={pickedPosition}
                offset={[25, 50]}
                cssColor={markerColor}
                image={markerImage}
                title={markerCaption}
              />
            )}
          </HbMapUncontrolled>
        </LoadabledComponent>
      </div>
    </>
  );
}

export default function MarkerViewMap({
  defaultZoom,
  markerColor,
  markerImage,
  markerCaption,
  markerPosition,
  hideAddress = false,
  hexagon
}) {
 
  const markerHexagonGeoJson = latLngToGeoJson(
    markerPosition[0],
    markerPosition[1],
    getZoomResolution(hexagonSizeZoom),
  );
  const sessionUser = useGlobalStore(
    (state: GlobalState) => state.sessionUser,
);
  const selectedNetwork = useSelectedNetwork()
  // return (<>lala</>)
  return (
    <>
      <div className="picker__map">
          <HbMapUncontrolled
            mapCenter={markerPosition}
            mapZoom={defaultZoom}
            height={'18'}
            tileType={HbMapTiles.FIRE}
          >
            {(sessionUser.role == Role.admin || sessionUser.endorsed) && 
            <GeoJsonLoader
              link={'/assets/barroso.geojson'}
              styleCallback={(feature, hover) => {
                if(feature.properties.name.startsWith('Silha')){
                  return { strokeWidth: "1", stroke: feature.properties.stroke };
                }
                if(feature.properties.name.startsWith('CONCESSAO')){
                  return { strokeWidth: "1", stroke: feature.properties.stroke, fill: '#f549274a' };
                }
                if(feature.properties.name.startsWith('R-baldio')){
                  return { strokeWidth: "1", stroke: feature.properties.stroke, fill: '#45f4195f' };
                }
                return { strokeWidth: "1", stroke: feature.properties.stroke, fill: feature.properties.fill };
              }}
            />}
            <GeoJsonLoader
              link={'/assets/silhas.geojson'}
              styleCallback={(feature, hover) => {
                if(feature.properties.name.startsWith('Silha')){
                  return { strokeWidth: "1", stroke: feature.properties.stroke };
                }
                return { strokeWidth: "1", stroke: feature.properties.stroke, fill: feature.properties.fill };
              }}
            />
            {/* {hideAddress && (
              <GeoJson
                data={markerHexagonGeoJson}
                styleCallback={(feature, hover) => {
                  return { fill: markerColor, opacity: 0.4 };
                }}
              />
            )} */}
            {!hideAddress && (
              // <MarkerButtonIcon
              //   anchor={markerPosition}
              //   offset={[25, 50]}
              //   cssColor={markerColor}
              //   image={markerImage}
              //   title={markerCaption}
              // />
              <Marker 
                  width={10}
                  anchor={markerPosition} 
                  color={'yellow'} 
                />
            )}
          </HbMapUncontrolled>
      </div>
    </>
  );
}