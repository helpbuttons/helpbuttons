import { useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import CardButtonMap from "components/map/CardButtonMap";
import { MarkersButton, MarkerSelector } from "components/map/MarkerButton";
import { ButtonService } from "services/Buttons";

const AddMarker = ({ handleClick }) => {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click: (e) => {
      const position = {
        type: "Point",
        coordinates: [e.latlng.lat, e.latlng.lng],
      };
      setPosition(position);
      handleClick(position);
      map.setView(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <MarkerSelector position={position}/>
  );
};


export default function Map({ buttons, style, addMarkerClick, initialLocation = {
  lat: "51.505",
  lng: "-0.09",
}, onBoundsChange }) {
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [zoom, setZoom] = useState(11);
  const getButtonsOnBounds = (map) => {
    onBoundsChange(map.getBounds())
  }

  return (
    <MapContainer
      center={currentLocation}
      zoom={zoom}
      scrollWheelZoom={true}
      style={style}
      whenCreated={(map) => getButtonsOnBounds(map)}
    >
      <TileLayer
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      />
      {buttons && <MarkersButton buttons={buttons} onBoundsChange={onBoundsChange}/>}
      {addMarkerClick && <AddMarker handleClick={addMarkerClick} />}
    </MapContainer>
  );
}
