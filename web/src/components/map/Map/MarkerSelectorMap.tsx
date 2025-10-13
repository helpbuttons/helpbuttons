import React, { useEffect, useRef, useState } from 'react';
import { HbMapUncontrolled } from '.';
import { GeoJson, Marker } from 'pigeon-maps';
import {
  getHexagonCenter,
  getZoomResolution,
  latLngToGeoJson,
} from 'shared/honeycomb.utils';
import { MarkerButtonIcon } from './MarkerButton';
import { LoadabledComponent } from 'components/loading';
import {
  hexagonSizeZoom,
} from './Map.consts';
import dconsole from 'shared/debugger';
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
}) {
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
      if (hideAddress) {
        let polygons = latLngToGeoJson(
          pickedPosition[0],
          pickedPosition[1],
          getZoomResolution(hexagonSizeZoom),
        );
        setMarkerHexagonGeoJson(() => polygons);
      } else {
        setMarkerHexagonGeoJson(() => null);
      }
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

  useEffect(() => {
    if (hideAddress) {
      if (zoom > hexagonSizeZoom) {
        setZoom(() => hexagonSizeZoom);
      }
    }
  }, [hideAddress]);

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
          >
            {(hideAddress && pickedPosition) && (
              <GeoJson
                data={markerHexagonGeoJson}
                styleCallback={(feature, hover) => {
                  return { fill: markerColor, opacity: 0.4 };
                }}
              />
            )}
            {(!hideAddress && pickedPosition) && (
              <MarkerButtonIcon
                anchor={pickedPosition}
                offset={[25, 50]}
                cssColor={markerColor}
                image={markerImage}
                title={markerCaption}
              />
            )}
            {(hideAddress  && pickedPosition)&& (
              <MarkerButtonIcon
                anchor={getHexagonCenter(pickedPosition, hexagonSizeZoom)}
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

  return (
    <>
      <div className="picker__map">
        <LoadabledComponent loading={!mapCenter}>
          <HbMapUncontrolled
            mapCenter={mapCenter}
            mapZoom={zoom}
            onBoundsChanged={onBoundsChanged}
            height={'18'}
          >
            {hideAddress && (
              <GeoJson
                data={markerHexagonGeoJson}
                styleCallback={(feature, hover) => {
                  return { fill: markerColor, opacity: 0.4 };
                }}
              />
            )}
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
