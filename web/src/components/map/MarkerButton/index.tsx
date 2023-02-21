///button marker over the map
import React, { useState } from "react";

import { Marker, Popup, useMapEvents } from "react-leaflet";
import { MarkerIcon} from "./IconButton";
import CardButtonMap from "components/map/CardButtonMap";
import { store } from "pages";
import { ClearCurrentButton } from "state/Explore";
import { buttonTypes } from "shared/buttonTypes";


export function MarkerSelector({ onClick, markerPosition, markerImage = null, markerCaption= '?', markerColor = 'red' }) {
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
        icon={MarkerIcon(markerCaption,markerImage,markerColor)}
      >
      </Marker>
    }
    </>
  );
}

export function CardMarkerButton({ button, children, onMarkerClick}) {
  const buttonType = buttonTypes.find((buttonType) => {
    return buttonType.name === button.type
  })
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
      icon={MarkerIcon(button.title, button.image, buttonType.color)}
      eventHandlers={{ click: (e) => {onMarkerClick(button.id, button.location.coordinates)}}}
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
    click: (e) => {
      const position = {lat: e.latlng.lat,lng: e.latlng.lng};
      map.setView([e.latlng.lat,e.latlng.lng], map.getZoom());
      store.emit(new ClearCurrentButton())
    },
  });
  const onMarkerClicked = (buttonId, buttonCoordinates) => {
    onMarkerClick(buttonId);
    console.log('clickeddd' + buttonId)
    map.setView(buttonCoordinates, map.getZoom());
  }
  const markers = buttons.map((button, i) => (
    <CardMarkerButton button={button} key={i} onMarkerClick={onMarkerClicked}>
        <Popup className="card-button-map--wrapper">
          <CardButtonMap
            key={i}
            button={button}
          />
        </Popup>
    </CardMarkerButton>
  ));

  // return <></>
  return markers;
}
