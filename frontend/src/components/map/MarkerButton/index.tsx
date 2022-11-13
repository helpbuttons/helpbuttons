///button marker over the map
import React, { useState } from "react";

import { Marker, Popup, useMapEvents } from "react-leaflet";
import { iconButton, iconSelector } from "./IconButton";
import CardButtonMap from "components/map/CardButtonMap";

export function MarkerSelector({ onClick, markerPosition }) {
  const [position, setPosition] = useState(markerPosition);

  const map = useMapEvents({
    click: (e) => {
      const position = {lat: e.latlng.lat,lng: e.latlng.lng};

      setPosition(position);
      onClick(position);
    },
  });
  
  return (
    <>
    {position && 
      <Marker
        position={position}
        icon={iconSelector()}
      >
      </Marker>
    }
    </>
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
export function MarkersButton({ buttons, onBoundsChange, ...props }) {
  const map = useMapEvents({
    moveend: (e) => {
      onBoundsChange(map.getBounds());
    },
  });
  const markers = buttons.map((button, i) => (
    <MarkerButton button={button} key={i}>
      <Popup className="card-button-map--wrapper">
        <CardButtonMap
          key={i}
          button={button}
        />
      </Popup>
    </MarkerButton>
  ));

  return markers;
}
