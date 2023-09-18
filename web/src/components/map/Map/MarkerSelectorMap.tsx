import React, { useEffect, useState } from 'react';
import { HbMap } from '.';
import { GeoJson, Point } from 'pigeon-maps';
import { latLngToGeoJson } from 'shared/honeycomb.utils';
import { MarkerButtonIcon } from './MarkerButton';
import { makeImageUrl } from 'shared/sys.helper';
import { cellToLatLng, latLngToCell } from 'h3-js';
import { maxResolution } from 'shared/types/honeycomb.const';

export default function MarkerSelectorMap({
  markerPosition,
  setMarkerPosition,
  zoom,
  markerColor,
  markerImage,
  markerCaption,
  showHexagon = false,
}) {
  const [mapCenter, setMapCenter] = useState<Point>(markerPosition);
  const [markerHexagonGeoJson, setMarkerHexagonGeoJson] =
    useState(null);
  const [hexagonCenter, setHexagonCenter] = useState(markerPosition);
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    // setMarkerPosition(center);
    // dont do it.. or else coordinates get updated twice.
  };

  const handleMapClicked = ({ event, latLng, pixel }) => {
    setMapCenter(latLng);
    setMarkerPosition(latLng);
  };

  useEffect(() => {
    let polygons = latLngToGeoJson(
      markerPosition[0],
      markerPosition[1],
    );

    setMarkerHexagonGeoJson(polygons);
    setHexagonCenter(() => {
      if(showHexagon)
      {
        const cell = latLngToCell(
          markerPosition[0],
          markerPosition[1],
          maxResolution,
        );
        const center = cellToLatLng(cell);
        return center;
      }
      return markerPosition
    });
  }, [markerPosition, showHexagon]);

  return (
    <>
      <div className="picker__map">
        <HbMap
          mapCenter={hexagonCenter}
          mapZoom={zoom}
          onBoundsChanged={onBoundsChanged}
          handleMapClick={handleMapClicked}
          width={'100%'}
          height={'16rem'}
        >
          <MarkerButtonIcon
            anchor={hexagonCenter}
            offset={[35, 65]}
            cssColor={markerColor}
            image={makeImageUrl(markerImage, '/api/')}
            title={markerCaption}
          />
          {showHexagon && (
            <GeoJson
              data={markerHexagonGeoJson}
              styleCallback={(feature, hover) => {
                return { fill: markerColor, opacity: 0.4 };
              }}
            />
          )}
        </HbMap>
      </div>
    </>
  );
}
