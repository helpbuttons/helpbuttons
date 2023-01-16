///button marker over the map
import React, { useState } from "react";

import { Marker, useMapEvents } from "react-leaflet";
import { MarkerIcon, MarkerButton } from "./IconButton";
import CardButtonMap from "components/map/CardButtonMap";


export function MarkerSelector({ onClick, markerPosition, markerImage = null, markerCaption= '?' }) {
  const [position, setPosition] = useState(markerPosition);
  const map = useMapEvents({
    click: (e) => {
      const position = {lat: e.latlng.lat,lng: e.latlng.lng};

      setPosition(position);
      onClick(position, map.getZoom());
      map.setView([e.latlng.lat,e.latlng.lng], map.getZoom());
    },
  });
  
  
  return (
    <>
    {position && 
      <Marker
        position={position}
        icon={MarkerIcon(markerCaption,markerImage)}
      >
      </Marker>
    }
    </>
  );
}

export function CardMarkerButton({ button, children, onMarkerClick = (buttonId) => {}}) {
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
      icon={MarkerButton(button.image, button.type, button.description)}
      eventHandlers={{ click: (e) => {onMarkerClick(button.id)}}}
    >
      {children}
    </Marker>
  );
}
export function MarkersButton({ buttons, onBoundsChange,onMarkerClick, ...props }) {
  const map = useMapEvents({
    moveend: (e) => {
      onBoundsChange(map.getBounds());
    },
  });
  const markers = buttons.map((button, i) => (
    <CardMarkerButton button={button} key={i} onMarkerClick={onMarkerClick}>
    </CardMarkerButton>
  ));

  // return <></>
  return markers;
}
