import React, { useEffect, useState } from 'react';
import { HbMapUncontrolled } from '.';
import { GeoJson, Point } from 'pigeon-maps';
import {
  getZoomResolution,
  latLngToGeoJson,
} from 'shared/honeycomb.utils';
import { MarkerButtonIcon } from './MarkerButton';
import { cellToLatLng, latLngToCell } from 'h3-js';
import { maxResolution } from 'shared/types/honeycomb.const';

export default function MarkerSelectorMap({
  markerPosition,
  defaultZoom,
  markerColor,
  markerImage,
  markerCaption,
  showHexagon = false,
  onMapClick = (latLng) => {},
}) {
  const [newMarkerPosition, setNewMarkerPosition] = useState<Point>(markerPosition);
  const [markerHexagonGeoJson, setMarkerHexagonGeoJson] =
    useState(null);
  const [zoom, setZoom] = useState(defaultZoom);
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    // setMarkerPosition(center);
    // dont do it.. or else coordinates get updated twice.
    setZoom(() => zoom);
  };

  const getHexagonCenter = (latLng, zoom) => {
    const cell = latLngToCell(
      latLng[0],
      latLng[1],
      getZoomResolution(zoom),
    );
    const center = cellToLatLng(cell);

    return center;
  };
  function handleMapClicked({ latLng }) {
    setNewMarkerPosition(() => latLng);
  }

  useEffect(() => {
    if (showHexagon) {
      onMapClick(getHexagonCenter(newMarkerPosition, zoom));
    } 
    else {
      onMapClick(newMarkerPosition);
    }
  }, [newMarkerPosition]);
  useEffect(() => {
    if (showHexagon) {
      let polygons = latLngToGeoJson(
        markerPosition[0],
        markerPosition[1],
        getZoomResolution(zoom),
      );
      setMarkerHexagonGeoJson(() => polygons);
    } else {
      setMarkerHexagonGeoJson(() => null);
    }
  }, [showHexagon, zoom, markerPosition]);
  return (
    <>
      <div className="picker__map">
        <HbMapUncontrolled
          mapCenter={markerPosition}
          mapZoom={zoom}
          onBoundsChanged={onBoundsChanged}
          handleMapClick={handleMapClicked}
          width={'100%'}
          height={'16rem'}
        >
          {showHexagon ? (
            <GeoJson
              data={markerHexagonGeoJson}
              styleCallback={(feature, hover) => {
                return { fill: markerColor, opacity: 0.4 };
              }}
            />
          ) : (
            <MarkerButtonIcon
              anchor={markerPosition}
              offset={[35, 65]}
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
