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
export function MarkerEditorMap(props) {
  return (
    <MarkerViewMap {...props}/>
  );
}

export default function MarkerViewMap({
  markerPosition,
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
      markerPosition[0] &&
      markerPosition[1]
    ) {
      setMapCenter(() => markerPosition);
    }
  }, [markerPosition]);

  function handleMapClicked({ latLng }) {
    if (hideAddress) {
      onMapClick(getHexagonCenter(latLng, zoom));
    } else {
      onMapClick(latLng);
    }
  }
  useEffect(() => {
    if (mapCenterIsReady.current) {
      if (hideAddress) {
        let polygons = latLngToGeoJson(
          markerPosition[0],
          markerPosition[1],
          getZoomResolution(hexagonSizeZoom),
        );
        setMarkerHexagonGeoJson(() => polygons);
      } else {
        setMarkerHexagonGeoJson(() => null);
      }
    } else {
      if (
        networkMapCenter &&
        networkMapCenter[0] &&
        networkMapCenter[1]
      ) {
        mapCenterIsReady.current = true;
        setMapCenter(() => networkMapCenter);
      } else if (markerPosition[0] && markerPosition[1]) {
        setMapCenter(() => markerPosition);
      }
    }
  }, [hideAddress, markerPosition, networkMapCenter]);

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
                anchor={markerPosition}
                offset={[35, 65]}
                cssColor={markerColor}
                image={markerImage}
                title={markerCaption}
              />
            )}
            {hideAddress && (
              <MarkerButtonIcon
                anchor={getHexagonCenter(markerPosition, hexagonSizeZoom)}
                offset={[35, 65]}
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
