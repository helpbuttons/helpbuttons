import React, { useEffect, useState } from 'react';
import { HbMap } from '.';
import { GeoJson, Point } from 'pigeon-maps';
import { latLngToGeoJson } from 'shared/honeycomb.utils';

export default function MarkerSelectorMap({
  markerPosition,
  setMarkerPosition,
  defaultZoom = 11,
  markerColor
}) {
  const [mapCenter, setMapCenter] = useState<Point>(markerPosition);
  const [mapZoom, setMapZoom] = useState(defaultZoom);
  const [markerHexagonGeoJson, setMarkerHexagonGeoJson] = useState(null)

  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    setMarkerPosition(center);

  };

  const handleMapClicked = ({ event, latLng, pixel }) => {
    setMapCenter(latLng);

    setMarkerPosition(latLng);
  };

  useEffect(() => {
    let polygons = latLngToGeoJson(markerPosition[0], markerPosition[1]);

    setMarkerHexagonGeoJson(polygons)

  }, [markerPosition])
  return (
    <>
     <div className='picker__map'>
        <HbMap
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          onBoundsChanged={onBoundsChanged}
          handleMapClick={handleMapClicked}
          width={'100%'}
          height={'60vh'}
        >
              <GeoJson
                data={markerHexagonGeoJson}
                styleCallback={(feature, hover) => {
                  return {fill: markerColor}
                }}
                
              />
        </HbMap>
      </div>
    </>
  );
}
