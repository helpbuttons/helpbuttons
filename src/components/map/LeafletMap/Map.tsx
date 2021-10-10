import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import CardButtonMap from 'components/map/CardButtonMap'
import MarkerButton from 'components/map/MarkerButton'

export default function Map() {

    const position = [51.505, -0.09]

    return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerButton>
      </MarkerButton>
    </MapContainer>
  )
}
