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
import { MarkerButton, MarkersButton } from "components/map/MarkerButton";
import { ButtonService } from "services/Buttons";

const AddMarker = ({ handleClick }) => {
  const [position, setPosition] = useState(null);

  const map = useMapEvents({
    click: (e) => {
      // console.log(e.latlng);

      // setPosition(e.latlng); // 👈 add marker
      const position = {
        type: "Point",
        coordinates: [e.latlng.lat, e.latlng.lng],
      };
      setPosition(position);
      handleClick(position);
      map.setView(e.latlng, map.getZoom());
      /* CODE TO ADD NEW PLACE TO STORE (check the source code) */
    },
  });

  return position === null ? null : (
    <MarkerButton position={position}></MarkerButton>
  );
};

export default function Map({ buttons, style, addMarkerClick, initialLocation = {
  lat: "51.505",
  lng: "-0.09",
} }) {
  const [currentLocation, setCurrentLocation] = useState(initialLocation);
  const [zoom, setZoom] = useState(8);

  return (
    <MapContainer
      center={currentLocation}
      zoom={zoom}
      scrollWheelZoom={true}
      style={style}
    >
      <TileLayer
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      />
      {buttons && <MarkersButton buttons={buttons} />}
      {addMarkerClick && <AddMarker handleClick={addMarkerClick} />}
    </MapContainer>
  );
}
