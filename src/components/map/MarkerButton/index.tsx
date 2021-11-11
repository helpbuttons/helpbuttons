///button marker over the map
import React from 'react';
import { map } from 'rxjs/operators';
import { useState } from 'react'

import { Marker, Popup } from 'react-leaflet'
import {  iconButton  } from './IconButton';
import CardButtonMap from 'components/map/CardButtonMap'

export default function MarkerButton ({buttons, ...props}) {

  let buttonArray = buttons.length > 0 ? buttons[0] : buttons;

  const markers = buttonArray.map((place, i) => (

          <Marker key={i} position={place.geoPlace ? { lat: place.geoPlace.coordinates[0], lng: place.geoPlace.coordinates[1]} : {lat:null,lng:null}} icon={ iconButton }>

          <Popup className="card-button-map--wrapper">
              <CardButtonMap />
          </Popup>

          </Marker>

  ));

  return markers;
};
