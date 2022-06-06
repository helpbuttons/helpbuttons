///button marker over the map
import React from "react";
import { map } from "rxjs/operators";
import { useState } from "react";

import { Marker, Popup } from "react-leaflet";
import { iconButton } from "./IconButton";
import CardButtonMap from "components/map/CardButtonMap";

export function MarkerButton({ position, children }) {
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
      icon={iconButton}
    >
      {children}
    </Marker>
  );
}
export function MarkersButton({ buttons, ...props }) {
  let buttonArray = buttons.length > 0 ? buttons[0] : buttons;

  const markers = buttonArray.map((button, i) => (
    <MarkerButton position={button.location} key={i}>
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
          location={button.geoPlace}
        />
      </Popup>
    </MarkerButton>
  ));

  return markers;
}
