// import React, { useState } from 'react'
import { Map, Point, ZoomControl } from 'pigeon-maps';
import { useEffect, useState } from 'react';
import { roundCoords } from 'shared/utils/honeycomb.utils';
import {
  HbMapTiles,
  HbTiles,
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
  const [tileType, setTileType] = useState<HbMapTiles>(HbMapTiles.OSM)
  const selectedNetwork: Network = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  

  const tileProvider = (x, y, z, dpr) => {
    return HbTiles(tileType,x,y,z,dpr)
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
      onBoundsChanged={({ center, zoom, bounds, initial }) => {
        if (mapZoom != zoom)
        {
          setMapZoom(zoom)
        }

        if(roundCoords(center)[0] != mapCenter[0])
        {
          setMapCenter(roundCoords(center));
        }
        handleBoundsChange({
          center: roundCoords(center),
          zoom: Math.floor(zoom),
          bounds,
        })

      }}
      zoomSnap={true}
      onClick={handleMapClick}
      provider={tileProvider}
      width={width}
      height={height}
      maxZoom={16}
      minZoom={4}
    >
      {children}
      <ZoomControl />

    </Map>
  );
}
