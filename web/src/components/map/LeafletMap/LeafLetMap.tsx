import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MarkersButton, MarkerSelector } from "components/map/MarkerButton";
import { useRef } from "store/Store";
import { GlobalState, store } from "pages";
import { IConfig } from "services/Setup/config.type";
import { GetConfig } from "state/Setup";
import { alertService } from "services/Alert";

export default function LeafLetMap({ center, onBoundsChange = (e) => {}, onMarkerClick = false, markerPosition = null, markersButtons = [], style = null, defaultZoom = 11}) {
  const [zoom, setZoom] = useState(defaultZoom);
  const getButtonsOnBounds = (map) => {
    onBoundsChange(map.getBounds())
  }

  const config :IConfig = useRef(store, (state: GlobalState) => state.config);

  function getConfig() {
    store.emit(
      new GetConfig(
        () => {
        },
        (err) => {
          alertService.error('Could not load configuration for leaflet, please contact the sysadmin')
        },
      ),
    );
  }

  useEffect(() => {
    if(!config) {
      getConfig();
    }
  }, []);
  
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={style}
      whenCreated={(map) => getButtonsOnBounds(map)}
    >
      {config && 
        <TileLayer
          attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
          url={config.leafletTiles}
        />
      }
      {onMarkerClick && 
        <MarkerSelector onClick={onMarkerClick} markerPosition={markerPosition}/>
      }
      <MarkersButton buttons={markersButtons} onBoundsChange={onBoundsChange}/>
    </MapContainer>
  );
}

