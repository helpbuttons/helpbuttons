import React, { useEffect, useRef, useState } from 'react';
import { HbMapUncontrolled } from '.';
import {
  getZoomResolution,
  latLngToGeoJson,
} from 'shared/honeycomb.utils';
import { LocationKeyIcon, MarkerButtonIcon } from './MarkerButton';
import { LoadabledComponent } from 'components/loading';
import {
  hexagonSizeZoom,
} from './Map.consts';
import { useSelectedNetwork } from 'state/Networks';
import { useKeyLocations } from 'state/Geo';
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
  const keyLocations = useKeyLocations()

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
              cssColor={'red'}/>
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
            {!isLocationKeyMarker && keyLocations?.length > 0 && 
              keyLocations.map((place, idx) => {
                return (
                  <LocationKeyIcon
                    key={idx}
                    anchor={[place.latitude, place.longitude]}
                    offset={[35, 65]}
                    color={'white'}
                    title={place.address}
                  />
                );
              })
            }
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
  const [mapCenter, setMapCenter] = useState(markerPosition);
  const [zoom, setZoom] = useState(defaultZoom)
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    setZoom(() => zoom);
    setMapCenter(() => center);
  };
  const markerHexagonGeoJson = latLngToGeoJson(
    markerPosition[0],
    markerPosition[1],
    getZoomResolution(hexagonSizeZoom),
  );
  const selectedNetwork = useSelectedNetwork()
  return (
    <>
      <div className="picker__map">
        <LoadabledComponent loading={!mapCenter}>
          <HbMapUncontrolled
            mapCenter={mapCenter}
            mapZoom={zoom}
            onBoundsChanged={onBoundsChanged}
            height={'18'}
            tileType={selectedNetwork.exploreSettings.tileType}
          >
            {/* {hideAddress && (
              <GeoJson
                data={markerHexagonGeoJson}
                styleCallback={(feature, hover) => {
                  return { fill: markerColor, opacity: 0.4 };
                }}
              />
            )} */}
            {!hideAddress && (
              <MarkerButtonIcon
                anchor={markerPosition}
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