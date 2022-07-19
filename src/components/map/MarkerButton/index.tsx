///button marker over the map
import React from "react";
import { map } from "rxjs/operators";
import { useState } from "react";

import { Marker, Popup } from "react-leaflet";
import { iconButton } from "./IconButton";
import CardButtonMap from "components/map/CardButtonMap";

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
export function MarkersButton({ buttons, ...props }) {
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
