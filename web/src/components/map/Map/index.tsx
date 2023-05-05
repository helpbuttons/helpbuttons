// import React, { useState } from 'react'
import { Map, Point, ZoomControl } from 'pigeon-maps';
import { useEffect, useState } from 'react';
import { osm } from 'pigeon-maps/providers';
import { roundCoords } from 'shared/honeycomb.utils';
import {
  StamenMapTypes,
  stamenTiles,
  stamenTilesTerrain,
} from './TileProviders';
import { Network } from 'shared/entities/network.entity';
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';

export function HbMap({
  children,
  mapCenter,
  mapZoom,
  setMapZoom,
  handleBoundsChange = (objectRet) => {},
  handleMapClick,
  width = null,
  height = null,
  setMapCenter,
  forceTileType = null,
}) {
  // const [zoom, setZoom] = useState(11);

  const [tileType, setTileType] = useState('osm')
  const selectedNetwork: Network = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  
  const setZoom = (zoom) => {
    setMapZoom(Math.floor(zoom));
  }
  

  const tileProvider = (x, y, z, dpr) => {
    switch (tileType) {
      case StamenMapTypes.TERRAIN:
      case StamenMapTypes.TONER:
      case StamenMapTypes.WATERCOLOR:
        return stamenTiles(tileType, x, y, z, dpr);
      default:
    }
    return osm(x, y, z);
  };

  useEffect(() => {
    if(selectedNetwork)
    {
      setTileType(selectedNetwork.tiletype)
    }
    if(forceTileType)
    {
      setTileType(forceTileType) 
    }
  }, [selectedNetwork, forceTileType])

  return (
    <Map
      center={mapCenter}
      zoom={mapZoom}
      onBoundsChanged={({ center, zoom, bounds }) => {
        setZoom(zoom);
        setMapCenter(center);
        const objectRet = {
          center: roundCoords(center),
          zoom,
          bounds,
        };
        handleBoundsChange(objectRet);
      }}
      zoomSnap={false}
      onClick={handleMapClick}
      provider={tileProvider}
      width={width}
      height={height}
      maxZoom={16}
      minZoom={2}
    >
      <ZoomControl />
      {children}
    </Map>
  );
}
