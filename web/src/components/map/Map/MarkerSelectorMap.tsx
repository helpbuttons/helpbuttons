import { useEffect, useState } from 'react';
import React from 'react';
import { Draggable, Map, Marker, Overlay, ZoomControl } from 'pigeon-maps';
import { osm } from 'pigeon-maps/providers';
import { MarkerButton, MarkerButtonIcon } from './MarkerButton';
import { makeImageUrl } from 'shared/sys.helper';

export default function MarkerSelectorMap({
  updateMarkerPosition = (latLng) => {},
  markerPosition,
  zoom = 11,
  markerImage,
  markerCaption,
  markerColor = 'yellow',
  handleZoomChange = (zoom) => {}
}) {
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);
  const [markerWidth, setMarkerWidth] = useState(0);
  const [markerHeight, setMarkerHeight] = useState(0);
  const SCROLL_PIXELS_FOR_ZOOM_LEVEL = 150

 
  const updateWindowDimensions = () => {
    const windowH = window.innerHeight * 0.8;
    const windowW = window.innerWidth * 0.7;

    setMapWidth(windowW * 0.7);
    setMapHeight(windowH * 0.8);

    setMarkerWidth(windowW * 0.2);
    setMarkerHeight(windowH * 0.2);
  };
  const updateWindowListener = () => {
    window.addEventListener('resize', updateWindowDimensions);
    updateWindowDimensions();
    return () =>
      window.removeEventListener('resize', updateWindowDimensions);
  };
  useEffect(() => {
    return updateWindowListener();
  }, []);

  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    updateMarkerPosition(center);
    handleZoomChange(zoom)
  };

  const handleMapClicked = ({event, latLng, pixel}) => {
    updateMarkerPosition(latLng);
  }

  useEffect(() => {
    const handleWheel = (event) => {
      const addToZoom = -event.deltaY / SCROLL_PIXELS_FOR_ZOOM_LEVEL
      
      handleZoomChange(Math.round(zoom + addToZoom))
      updateMarkerPosition(markerPosition);
    }
    document.addEventListener('wheel', handleWheel);
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  } ,[zoom])
  
  
  return (
    <>
      <Map
        height={mapHeight}
        width={mapWidth}
        wheelEvents={false}
        center={markerPosition}
        zoom={zoom}
        provider={osm}
        onBoundsChanged={onBoundsChanged}
        onClick={handleMapClicked}
      >
        <ZoomControl />
        <MarkerButtonIcon anchor={markerPosition} offset={[35, 65]} cssColor={markerColor} image={makeImageUrl(markerImage, '/api/')} title={markerCaption}/>
      </Map>
    </>
  );
}
