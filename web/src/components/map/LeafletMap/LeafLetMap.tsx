import { useState } from "react";
import {
  MapContainer,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MarkersButton, MarkerSelector } from "components/map/MarkerButton";
import { useRef } from "store/Store";
import { GlobalState, store } from "pages";
import { IConfig } from "services/Setup/config.type";

export default function LeafLetMap({ center, onBoundsChange = (e) => {}, onMarkerClick = false, markerPosition = null, markersButtons = [], style = null}) {
  const [zoom, setZoom] = useState(11);
  const getButtonsOnBounds = (map) => {
    onBoundsChange(map.getBounds())
  }
  const config :IConfig = useRef(store, (state: GlobalState) => state.config);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={style}
      whenCreated={(map) => getButtonsOnBounds(map)}
    >
      <TileLayer
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        url={config.leafletTiles}
      />
      {onMarkerClick && 
        <MarkerSelector onClick={onMarkerClick} markerPosition={markerPosition}/>
      }
      <MarkersButton buttons={markersButtons} onBoundsChange={onBoundsChange}/>
    </MapContainer>
  );
}

