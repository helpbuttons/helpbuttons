import { useEffect, useState } from 'react';
import React from 'react';
import { Draggable, Map, Marker } from 'pigeon-maps';
import { stamenTerrain } from 'pigeon-maps/providers';
import { MarkerButton } from './MarkerButton';
import { makeImageUrl } from 'shared/sys.helper';

export default function MarkerSelectorMap({
  updateMarkerPosition = (latLng) => {},
  markerPosition,
  defaultZoom = 11,
  markerImage,
  markerCaption,
  markerColor,
  handleZoomChange = (zoom) => {}
}) {
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);
  const [markerWidth, setMarkerWidth] = useState(0);
  const [markerHeight, setMarkerHeight] = useState(0);
  const [position, setPosition] = useState(markerPosition);

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
  const mapClicked = ({ event, latLng, pixel }) => {
    console.log('handle marker position change')
    console.log(latLng)
    updateMarkerPosition(latLng);
    setPosition(latLng);
    // debugger;
  };

  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    handleZoomChange(zoom)
  };
  return (
    <>
      <Map
        height={mapHeight}
        width={mapWidth}
        defaultCenter={markerPosition}
        defaultZoom={defaultZoom}
        provider={stamenTerrain}
        onClick={mapClicked}
        onBoundsChanged={onBoundsChanged}
      >
        <Marker anchor={markerPosition} >
                        <img src={makeImageUrl(markerImage, '/api/')} width={40} height={40}/>
                    </Marker>
        
      </Map>
    </>
  );
}
