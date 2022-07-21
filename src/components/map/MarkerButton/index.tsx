///button marker over the map
import React from "react";

import { Marker, Popup, useMapEvents } from "react-leaflet";
import { iconButton, iconSelector } from "./IconButton";
import CardButtonMap from "components/map/CardButtonMap";

export function MarkerSelector({ position }) {
  return (
    <Marker
      position={
        position
          ? {
              lat: position.coordinates[0],
              lng: position.coordinates[1],
            }
          : { lat: null, lng: null }
      }
      icon={iconSelector()}
    >
    </Marker>
  );
}

export function MarkerButton({ button, children }) {
  return (
    <Marker
      position={
        button.location
          ? {
              lat: button.location.coordinates[0],
              lng: button.location.coordinates[1],
            }
          : { lat: null, lng: null }
      }
      icon={iconButton(button)}
    >
      {children}
    </Marker>
  );
}
export function MarkersButton({ buttons,onBoundsChange, ...props }) {
  const map = useMapEvents({
    moveend: (e) => {
      onBoundsChange(map.getBounds());
    },
  });
  const markers = buttons.map((button, i) => (
    <MarkerButton button={button} key={i}>
      <Popup className="card-button-map--wrapper">
        <CardButtonMap
          key={button.id}
          type={button.type}
          userName={button.owner}
          images={button.images}
          buttonName={button.name}
          tags={button.tags}
          description={button.description}
          date={button.date}
          location={button.location}
        />
      </Popup>
    </MarkerButton>
  ));

  return markers;
}
