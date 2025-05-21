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
export function MarkerEditorMap(props) {
  return (
    <MarkerViewMap {...props} />
  );
}

export default function MarkerViewMap({
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
  const [mapCenter, setMapCenter] = useState(pickedPosition);
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
          <HbMapUncontrolled
            mapCenter={mapCenter}
            mapZoom={zoom}
            onBoundsChanged={onBoundsChanged}
            handleMapClick={handleMapClicked}
            width={'100%'}
            height={'16rem'}
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
                anchor={pickedPosition}
                offset={[25, 50]}
                cssColor={markerColor}
                image={markerImage}
                title={markerCaption}
              />
            )}
            {hideAddress && (
              <MarkerButtonIcon
                anchor={getHexagonCenter(pickedPosition, hexagonSizeZoom)}
                offset={[25, 50]}
                cssColor={markerColor}
                image={markerImage}
                title={markerCaption}
              />
            )}
          </HbMapUncontrolled>
      </div>
    </>
  );
}
