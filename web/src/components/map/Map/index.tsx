// import React, { useState } from 'react'
import { Map, Point, ZoomControl } from 'pigeon-maps';
import { useEffect, useState } from 'react';
import { HbMapTiles, HbTiles, maxZoom, minZoom } from './Map.consts';
import { LoadabledComponent } from 'components/loading';

interface HbMapProps {
  center: Point;
  defaultZoom: number;
  onBoundsChanged: ({
    center,
    zoom,
    bounds,
    initial,
  }: {
    center: any;
    zoom: any;
    bounds: any;
    initial: any;
  }) => void;
  zoomSnap: boolean;
  onClick: ({ event, latLng, pixel }) => void;
  provider: (x: any, y: any, z: any, dpr: any) => string;
  width?: string;
  height?: string;
  maxZoom: number;
  minZoom: number;
}

export function HbMap({
  children,
  mapCenter,
  mapZoom,
  onBoundsChanged = (objectRet) => {},
  tileType = HbMapTiles.OSM,
  handleClick,
}) {
  const tileProvider = (x, y, z, dpr) => {
    return HbTiles(tileType, x, y, z, dpr);
  };
  return (
    <Map
      center={mapCenter}
      zoom={mapZoom}
      onBoundsChanged={({ center, zoom, bounds }) => {
        onBoundsChanged({
          center: center,
          zoom: zoom,
          bounds,
        });
      }}
      onClick={({ event, latLng, pixel }) => {
        handleClick({ latLng });
      }}
      zoomSnap={false}
      provider={tileProvider}
      maxZoom={maxZoom}
      minZoom={4}
    >
      {children}
      <ZoomControl />
    </Map>
  );
}

export function HbMapUncontrolled({
  children,
  mapCenter,
  mapZoom,
  onBoundsChanged = (objectRet) => {},
  handleMapClick = ({latLng}) => {},
  width,
  height = null,
  tileType = HbMapTiles.OSM,
}) {
  const tileProvider = (x, y, z, dpr) => {
    return HbTiles(tileType, x, y, z, dpr);
  };

  const [mapProps, setMapProps] = useState(() => {
    let mapProps: HbMapProps = {
      center: mapCenter,
      defaultZoom: mapZoom,
      onBoundsChanged: ({ center, zoom, bounds, initial }) => {
        onBoundsChanged({
          center: center,
          zoom: zoom,
          bounds,
        });
      },
      zoomSnap: false,
      onClick: ({ event, latLng, pixel }) => {
        handleMapClick({ latLng });
      },
      provider: tileProvider,
      maxZoom: maxZoom,
      minZoom: minZoom,
    };
    if (width !== null) {
      mapProps = { ...mapProps, width };
    }
    if (height !== null) {
      mapProps = { ...mapProps, height };
    }
    return mapProps;
  });

  useEffect(() => {
    setMapProps((prevMapProps) => {
      return {
        ...prevMapProps,
        provider: tileProvider,
        center: mapCenter,
        zoom: mapZoom
      };
    });
  }, [tileType, mapZoom, mapCenter]);

  return (
    <LoadabledComponent loading={!mapCenter}>
    <Map {...mapProps}>
      {children}
      <ZoomControl />
    </Map>
    </LoadabledComponent>
  );
}
