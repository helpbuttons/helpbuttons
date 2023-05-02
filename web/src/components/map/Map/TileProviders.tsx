export enum StamenMapTypes {
  TONER = 'toner',
  TERRAIN = 'terrain',
  WATERCOLOR = 'watercolor',
}
export function stamenTiles(
  mapType: StamenMapTypes,
  x: number,
  y: number,
  z: number,
  dpr: number,
) :string {
    return `https://stamen-tiles.a.ssl.fastly.net/${mapType}/${z}/${x}/${y}${(dpr >= 2 ? '@2x' : '')}.png`;
}

export function stamenTilesToner(
  x: number,
  y: number,
  z: number,
  dpr: number,
) {
  return stamenTiles(StamenMapTypes.TONER, x, y, z, dpr);
}

export function stamenTilesWaterColor(
  x: number,
  y: number,
  z: number,
  dpr: number,
) {
    return stamenTiles(StamenMapTypes.WATERCOLOR, x, y, z, dpr);
}

export function stamenTilesTerrain(
  x: number,
  y: number,
  z: number,
  dpr: number,
) {
    return stamenTiles(StamenMapTypes.TERRAIN, x, y, z, dpr);
}