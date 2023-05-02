import React, { useEffect, useState } from 'react';
import { Point } from 'pigeon-maps';
import { Button } from 'shared/entities/button.entity';
import { MarkerButton, MarkerButtonPopup } from './MarkerButton';
import { store } from 'pages';
import {
  updateCurrentButton,
  updateExploreMapZoom,
  updateMapCenter,
} from 'state/Explore';
import { HbMap } from '.';
const SCROLL_PIXELS_FOR_ZOOM_LEVEL = 150;

export default function ExploreMap({
  filteredButtons,
  currentButton,
  handleBoundsChange,
  mapDefaultZoom,
  mapDefaultCenter,
  tileType,
}) {
  const [mapCenter, setMapCenter] = useState<Point>(mapDefaultCenter);

  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    store.emit(new updateMapCenter(center));
    store.emit(new updateExploreMapZoom(zoom));

    handleBoundsChange(bounds, center, zoom);
  };

  const handleMarkerClicked = (button: Button) => {
    setMapCenter([button.latitude, button.longitude]);
    store.emit(
      new updateMapCenter([button.latitude, button.longitude]),
    );
    store.emit(new updateCurrentButton(button));
  };
  const handleMapClicked = ({ event, latLng, pixel }) => {
    setMapCenter(latLng);

    store.emit(new updateMapCenter(latLng));
    store.emit(new updateCurrentButton(null));
  };

  useEffect(() => {

  })
  
  return (
    <>
      {mapDefaultZoom && mapDefaultCenter && (
        <HbMap
          mapCenter={mapCenter}
          defaultZoom={mapDefaultCenter}
          handleBoundsChange={onBoundsChanged}
          handleMapClick={handleMapClicked}
          setMapCenter={setMapCenter}
          tileType={tileType}
        >
          {filteredButtons.map((button: Button, idx) => (
            <MarkerButton
              key={idx}
              anchor={[button.latitude, button.longitude]}
              offset={[35, 65]}
              button={button}
              handleMarkerClicked={handleMarkerClicked}
              currentButtonId={currentButton?.id}
            />
          ))}

          {currentButton && (
            <MarkerButtonPopup
              anchor={[
                currentButton.latitude,
                currentButton.longitude,
              ]}
              offset={[155, 328]}
              button={currentButton}
            />
          )}
        </HbMap>
      )}
    </>
  );
}
