// import React, { useState } from 'react'
import { Map, Point, ZoomControl } from 'pigeon-maps';
import { useEffect, useState } from 'react';
import { roundCoords } from 'shared/honeycomb.utils';
import {
  HbMapTiles,
  HbTiles,
} from './Map.consts';

interface HbMapProps {
  center: Point, 
  defaultZoom: number,
  onBoundsChanged: ({ center, zoom, bounds, initial }: { center: any; zoom: any; bounds: any; initial: any; }) => void,
  zoomSnap: boolean,
  onClick: ({ event, latLng, pixel }) => void,
  provider: (x: any, y: any, z: any, dpr: any) => string,
  width?: number,
  height?: number,
  maxZoom: number,
  minZoom: number,
  showListFullHeight,
}

export function HbMap({
  children,
  mapCenter,
  mapZoom,
  onBoundsChanged = (objectRet) => {},
  handleMapClick = () => {},
  width = null,
  height = null,
  tileType = HbMapTiles.OSM,
  showListFullHeight,
}) { 

  const tileProvider = (x, y, z, dpr) => {
    return HbTiles(tileType,x,y,z,dpr)
  };

  const [mapProps, setMapProps] = useState(() => {
    let mapProps: HbMapProps = {
      center: mapCenter, 
      defaultZoom: mapZoom,
      onBoundsChanged: ({ center, zoom, bounds, initial }) => {
        onBoundsChanged({
          center: roundCoords(center),
          zoom: Math.floor(zoom),
          bounds,
        })
      },
      zoomSnap: false,
      onClick: ({ event, latLng, pixel }) => {handleMapClick({latLng})},
      provider: tileProvider,
      maxZoom: 14,
      minZoom: 4,
    }
    if (width !== null)
    {
      mapProps = {...mapProps, width}
    }
    if (height !== null)
    {
      mapProps = {...mapProps, height}
    }
    return mapProps;
  })

  useEffect(() => {
    setMapProps((prevMapProps) => {return {...prevMapProps, provider: tileProvider, center: mapCenter}})
  },
  [tileType, mapZoom, mapCenter])

  return (
    <Map
      {...mapProps}
    >
      {children}
      {!showListFullHeight &&
      
        <ZoomControl />

      }

    </Map>
  );
}
