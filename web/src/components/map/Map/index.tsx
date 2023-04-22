// import React, { useState } from 'react'
import { Map, Point, ZoomControl } from 'pigeon-maps'
import { useEffect, useState } from 'react'
import { osm } from 'pigeon-maps/providers';

export function HbMap({children, mapCenter, defaultZoom, handleBoundsChange, handleMapClick, width = null, height= null}) {
  const [zoom, setZoom] = useState(11)
  const [mapInternalCenter, setMapCenter] = useState(mapCenter)
  useEffect(() => {
    if (mapInternalCenter != mapCenter)
    {
      setMapCenter(mapCenter)
    }
    
  }, [mapCenter])
   return (
    <Map 
      center={mapInternalCenter} 
      zoom={zoom} 
      onBoundsChanged={({ center, zoom,bounds }) => { 
        setZoom(zoom) 
        setMapCenter(center)
        handleBoundsChange({center, zoom, bounds})
      }}
      zoomSnap={true}
      onClick={handleMapClick}
      provider={osm}
      width={width}
      height={height}
    >
      <ZoomControl />
      {children}
      </Map>
  )
}