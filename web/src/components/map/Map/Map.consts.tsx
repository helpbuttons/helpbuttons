export enum HbMapTiles {
  TONER = 'toner',
  TERRAIN = 'terrain',
  WATERCOLOR = 'watercolor',
  OSM = 'osm',
  SATELLITE = 'satellite',
}
export function HbTiles(
  mapType: HbMapTiles,
  x: number,
  y: number,
  z: number,
  dpr: number,
): string {
  if (mapType == HbMapTiles.OSM) {
    return osm(x,y,z)
  }
  if (mapType == HbMapTiles.SATELLITE) {
    return satellite(x,y,z)
  }
    return `//tiles.stadiamaps.com/tiles/stamen_${mapType}/${z}/${x}/${y}${
      dpr >= 2 ? '@2x' : ''
    }.jpg`;
}

export function osm(
  x: number,
  y: number,
  z: number
) {
  const s = String.fromCharCode(97 + ((x + y + z) % 3));
    return `https://${s}.tile.openstreetmap.org/${z}/${x}/${y}.png`;
}

export function satellite(
  x: number,
  y: number,
  z: number
) {
  // ESRI World Imagery - free satellite imagery
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
}


export enum BrowseType {
  PINS = 'pins',
  HONEYCOMB = 'honeycomb',
  LIST = 'list',
}

export const maxZoom = 18;
export const minZoom = 4;
export const hexagonSizeZoom = 14;
export const onMarkerPositionChangeZoomTo = 10;
export const showMarkersZoom = maxZoom - 2;
export const showHexagonsZoom = maxZoom - 4;
export const markerFocusZoom = 14;