import {  useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MarkersButton,
  MarkerSelector,
} from 'components/map/MarkerButton';
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { SetupDtoOut } from 'shared/entities/setup.entity';

export default function LeafLetMap({
  center,
  onBoundsChange,
  onMarkerClick,
  markerPosition = null,
  markersButtons = [],
  style = null,
  defaultZoom,
  markerImage = null,
  markerCaption = '?',
  isMarkerSelector = false,
  markerColor= 'gray'
}) {
  const [zoom, setZoom] = useState(defaultZoom);
  const [map, setMap] = useState(null)
  const getButtonsOnBounds = (map) => {
    onBoundsChange(map.getBounds());
  };
  
  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );
  useEffect(() => {
    if(map && center) {
      console.log('setting center')
      map.setView(center, map.getZoom());
    }
    
  }, [center]);


  useEffect(() => {
    if(map && center) {
      map.setView(center, map.getZoom());
    }
  }, [center]);

  return (
    <>
    
      {config && (
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
          
          {(() => {
          if (isMarkerSelector) {
            return (<MarkerSelector
              onClick={onMarkerClick}
              markerImage={markerImage}
              markerPosition={markerPosition}
              markerCaption={markerCaption}
              markerColor={markerColor}
            />)
          }else if (markersButtons) {
            return (<MarkersButton buttons={markersButtons} onBoundsChange={onBoundsChange}
            onMarkerClick={onMarkerClick}
            />)
          }else {
            <>Loading...</>
          }
        })()}
        </MapContainer>
      )}
    </>
  );
}