export enum HbMapTiles {
  TONER = 'toner',
  TERRAIN = 'terrain',
  WATERCOLOR = 'watercolor',
  OSM = 'osm',
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


export enum BrowseType {
  PINS = 'pins',
  HONEYCOMB = 'honeycomb',
  LIST = 'list',
}

export const maxZoom = 18;
export const hexagonSizeZoom = 14;
export const onMarkerPositionChangeZoomTo = 10;
