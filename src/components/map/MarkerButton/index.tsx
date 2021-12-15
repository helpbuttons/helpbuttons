///button marker over the map
import React from 'react';
import { map } from 'rxjs/operators';
import { useState } from 'react'

import { Marker, Popup } from 'react-leaflet'
import {  iconButton  } from './IconButton';
import CardButtonMap from 'components/map/CardButtonMap'

export default function MarkerButton ({buttons, ...props}) {

  let buttonArray = buttons.length > 0 ? buttons[0] : buttons;

  const markers = buttonArray.map((btn, i) => (

          <Marker key={btn.id} position={btn.geoPlace ? { lat: btn.geoPlace.coordinates[0], lng: btn.geoPlace.coordinates[1]} : {lat:null,lng:null}} icon={ iconButton }>

            <Popup className="card-button-map--wrapper">
                <CardButtonMap key={btn.id} type={btn.type} userName={btn.owner} images={btn.images} buttonName={btn.name} tags={btn.tags} description={btn.description} date={btn.date} location={btn.geoPlace}/>
            </Popup>

          </Marker>

  ));

  return markers;
};
