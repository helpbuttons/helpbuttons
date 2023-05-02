// import React, { useState } from 'react'
import { Map, Point, ZoomControl } from 'pigeon-maps'
import { useEffect, useState } from 'react'
import { osm } from 'pigeon-maps/providers';
import { roundCoords } from 'shared/honeycomb.utils';

export function HbMap({children, mapCenter, defaultZoom, handleBoundsChange, handleMapClick, width = null, height= null, setMapCenter}) {
  const [zoom, setZoom] = useState(11)

   return (
    <Map 
      center={mapCenter} 
      zoom={zoom} 
      onBoundsChanged={({ center, zoom,bounds }) => { 
        setZoom(zoom) 
        setMapCenter(center)
        const objectRet = {center: roundCoords(center), zoom, bounds}
        handleBoundsChange(objectRet)
      }}
      zoomSnap={true}
      onClick={handleMapClick}
      provider={osm}
      width={width}
      height={height}
      maxZoom={16}
      minZoom={2}
    >
      <ZoomControl />
      {children}
      </Map>
  )
}