import { useState, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CardButtonMap from 'components/map/CardButtonMap'
import MarkerButton from 'components/map/MarkerButton'
import { ButtonService } from 'services/Buttons';


export default function Map(props) {

    const [state, setState] = useState({
        currentLocation: {lat: '51.505',lng: '-0.09'},
        zoom:13,
    })

    const {buttons} = props;

    return (
    <MapContainer center={state.currentLocation} zoom={state.zoom} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
      />
      <MarkerButton buttons={buttons}/>
    </MapContainer>
  )
}
