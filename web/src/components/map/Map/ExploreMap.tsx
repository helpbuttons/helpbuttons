import React, { useEffect, useState } from 'react';
import { Map, ZoomControl } from 'pigeon-maps';
import { stamenTerrain } from 'pigeon-maps/providers';
import { Button } from 'shared/entities/button.entity';
import { MarkerButton, MarkerButtonPopup } from './MarkerButton';
import { store } from 'pages';
import { SetAsCurrentButton, updateCurrentButton, updateExploreMapZoom, updateMapCenter } from 'state/Explore';
const SCROLL_PIXELS_FOR_ZOOM_LEVEL = 150


export default function ExploreMap(
    {
      filteredButtons,
      currentButton,
      handleBoundsChange,
      mapZoom,
      mapCenter
    }) {
  
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    handleBoundsChange(bounds, center, zoom);
  };

  const handleMarkerClicked = (button: Button) => {
    store.emit(new updateMapCenter([button.latitude, button.longitude]))
    store.emit(new updateCurrentButton(button))
  }
  const handleMapClicked = ({ event, latLng, pixel }) => {
    store.emit(new updateMapCenter(latLng))
    store.emit(new updateCurrentButton(null))
  }
  const mapRef = React.createRef();
  useEffect(() => {
    const handleWheel = (event) => {
      const addToZoom = -event.deltaY / SCROLL_PIXELS_FOR_ZOOM_LEVEL
      store.emit(new updateExploreMapZoom(mapZoom + addToZoom))
    }
    document.addEventListener('wheel', handleWheel);
    return () => {
      document.removeEventListener('wheel', handleWheel);
    };
  }, [mapZoom])
  return (
    <>
        {(mapZoom && mapCenter) && 
          <Map
            center={mapCenter}
            zoom={mapZoom}
            provider={stamenTerrain}
            onBoundsChanged={onBoundsChanged}
            zoomSnap={true}
            wheelEvents={false}
            onClick={handleMapClicked}
          >
            <ZoomControl />
            {filteredButtons.map((button: Button, idx) => (
              <MarkerButton key={idx} anchor={[button.latitude, button.longitude]} offset={[35, 65]} button={button} handleMarkerClicked={handleMarkerClicked} currentButtonId={currentButton?.id}/>
            ))}

            {currentButton && 
              <MarkerButtonPopup
              anchor={[currentButton.latitude, currentButton.longitude]} offset={[155, 328]} button={currentButton}
            />
            }
            
          </Map>
          }
    </>
  );
}
