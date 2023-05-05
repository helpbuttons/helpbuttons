import React, { useState } from 'react';
import { MarkerButtonIcon } from './MarkerButton';
import { makeImageUrl } from 'shared/sys.helper';
import { HbMap } from '.';
import { Point } from 'pigeon-maps';

export default function MarkerSelectorMap({
  updateMarkerPosition = (latLng) => {},
  markerPosition,
  defaultZoom = 11,
  markerImage,
  markerCaption,
  markerColor = 'yellow',
  handleZoomChange = (zoom) => {}
}) {
  const [mapCenter, setMapCenter] = useState<Point>(markerPosition);
  const [mapZoom, setMapZoom] = useState(defaultZoom);

  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    updateMarkerPosition(center);
    handleZoomChange(zoom)
  };

  const handleMapClicked = ({event, latLng, pixel}) => {
    setMapCenter(latLng);

    updateMarkerPosition(latLng);
  }
  
  return (
    <>
      <HbMap
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        setMapZoom={setMapZoom}
        handleBoundsChange={onBoundsChanged}
        handleMapClick={handleMapClicked}
        width={'60vw'}
        height={'60vh'} setMapCenter={setMapCenter}>
        <MarkerButtonIcon anchor={markerPosition} offset={[35, 65]} cssColor={markerColor} image={makeImageUrl(markerImage, '/api/')} title={markerCaption}/>
      </HbMap>
    </>
  );
}
