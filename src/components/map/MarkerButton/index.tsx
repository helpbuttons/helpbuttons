///button marker over the map
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import {  iconButton  } from './IconButton';
import CardButtonMap from 'components/map/CardButtonMap'
import CrossIcon from '../public/assets/svg/icons/cross1.tsx'


export default function MarkerButton () {

  const position = [51.505, -0.09];


  return (

      <Marker
        position={position}
        icon={ iconButton }
        >
        <Popup className="card-button-map--wrapper">
            <CardButtonMap />
        </Popup>
      </Marker>

  )
}
