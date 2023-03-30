import React, { useState } from 'react';
import { Map, ZoomControl } from 'pigeon-maps';
import { stamenTerrain } from 'pigeon-maps/providers';
import { Button } from 'shared/entities/button.entity';
import { MarkerButton } from './MarkerButton';

export default function ExploreMap({
  center,
  defaultZoom,
  markers,
  handleBoundsChange = (bounds) => {},
}) {
  const [mapZoom, setMapZoom] = useState(defaultZoom);
  const [currentButtonId, setCurrentButtonId] = useState(null) 
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    handleBoundsChange(bounds);
    setMapZoom(zoom);
  };

  
  const handleMarkerClicked = (buttonId) => {
    setCurrentButtonId(buttonId)
  }
  return (
    <>

          <Map
            defaultCenter={center}
            defaultZoom={mapZoom}
            provider={stamenTerrain}
            onBoundsChanged={onBoundsChanged}
            zoomSnap={true}
          >
            <ZoomControl />
            {markers.map((button: Button, idx) => (
              <MarkerButton anchor={[button.latitude, button.longitude]} offset={[35, 65]} button={button} handleMarkerClicked={handleMarkerClicked} currentButtonId={currentButtonId}/>
            ))}
          </Map>
    </>
  );
}
