import { Bounds } from 'pigeon-maps';
import {
  cellToChildren, cellToLatLng, latLngToCell,
} from 'h3-js';
import { featureToH3Set, h3SetToFeature } from 'geojson2h3';
import _ from 'lodash';
import { maxResolution } from './types/honeycomb.const';

export function convertBoundsToGeoJsonPolygon(bounds: Bounds) {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      coordinates: [convertBoundsToPolygon(bounds)],
      type: 'Polygon',
    },
  };
}


export function featuresToGeoJson(features) {
  return {
    "type": "FeatureCollection",
    "features": features
  };
}


export function convertBoundsToPolygon(bounds: Bounds) {
  if(!bounds)
  {
    throw new Error('bounds are null ')
  }
  return [
    [bounds.sw[1], bounds.sw[0]],
    [bounds.sw[1], bounds.ne[0]],
    [bounds.ne[1], bounds.ne[0]],
    [bounds.ne[1], bounds.sw[0]],
  ];
}

export function convertBoundsToGeoJsonHexagons(
  bounds: Bounds,
  resolution: number,
) {
  const polygon = convertBoundsToGeoJsonPolygon(bounds);
  const hexs = featureToH3Set(polygon, resolution);
  return hexs;
}


export function getGeoJsonHexesForBounds(bounds, resolution)
{
  const hexagons = convertBoundsToGeoJsonHexagons(bounds,resolution);
  return  convertHexesToFeatures(hexagons, resolution)
}
export function convertHexesToFeatures(
  hexagones: string[],
  resolution,
) {
  return hexagones.map((hex, idx) => {
    const geojsonHex = h3SetToFeature([hex]);
    return {
      ...geojsonHex,
      properties: {
        ...geojsonHex.properties,
        hex: hex,
        resolution,
        idx: idx,
        center: cellToLatLng(hex),
        count: 0,
      },
    };
  });
}

export function latLngToGeoJson(lat, lng)
{
  const hex = latLngToCell(lat, lng, maxResolution)
  return featuresToGeoJson([h3SetToFeature([hex])])
}
export function getDegreesBleed(zoom: number, bounds: Bounds) : Bounds
{
  let extende = 0.001;
  if (zoom < 5) {
    extende = 3
  } else if (Math.abs(zoom - 5) < 3) {
    extende = 2
  } else if (zoom < 10) {
    extende = 0.5
  } else if (zoom < 17) {
    extende = 0.01
  }
  let newBounds = bounds;

  newBounds.sw[0] = newBounds.sw[0] - extende;
  newBounds.sw[1] = newBounds.sw[1] - extende;
  newBounds.ne[0] = newBounds.ne[0] + extende;
  newBounds.ne[1] = newBounds.ne[1] + extende;

  return newBounds;
}

export function getResolution(zoom) {
  switch (zoom) {
    case 4:
      return 1;
    case 5:
      return 2;
    case 6:
    case 7:
      return 3;
    case 8:
      return 4;
    case 9:
      return 5;
    case 10:
    case 11:
      return 6;
    case 12:
    case 13:
      return 7;
    case 14:
    case 15:
    case 16:
      return 8;

    default: 
      return 1;
  }
}
export function getBottomHexes(hex) {
  return cellToChildren(hex, maxResolution);
}

export function hideHex(hexClicked, resolution, bottomSelectedHexes) {
  if (maxResolution == resolution) {
    return _.union(bottomSelectedHexes, [hexClicked]);
  }
  const bottomHexes = getBottomHexes(hexClicked);
  return _.union(bottomSelectedHexes, bottomHexes);
}

export function showHex(hexClicked, resolution, bottomSelectedHexes) {

  if (maxResolution == resolution) {
    const selectecHexes = bottomSelectedHexes.filter(
      (hex) => hexClicked != hex,
    );
    return selectecHexes;
  }
  const bottomHexes = getBottomHexes(hexClicked);
  return _.difference(bottomSelectedHexes, bottomHexes);
}

export function roundCoords(point){
  return [Math.floor(point[0] * 10000) / 10000, Math.floor(point[1] * 10000) / 10000];
}

export function convertH3DensityToFeatures(
  hexagones,
) {

  if(hexagones.length < 1)
  {
    return []
  }
  return _.map(hexagones, (hexes, idx) => {
    // return {hex:idx, count: hex.length}
    const geojsonHex = h3SetToFeature([idx]);
    return {
      ...geojsonHex,
      properties: {
        ...geojsonHex.properties,
        hex: idx,
        center: cellToLatLng(idx),
        count: hexes.length
      },
    };
  })
}

export function getBoundsHexFeatures(bounds, mapZoom)
{
  const newGeoJsonHexesBounds = getGeoJsonHexesForBounds(
    getDegreesBleed(mapZoom, bounds),
    getResolution(mapZoom),
  );
  if (newGeoJsonHexesBounds.length > 500) {
    console.error(`Too many features, throwing for safety. numfeatures: ${newGeoJsonHexesBounds.length} zoom: ${mapZoom}`)
    return []
  }
  return newGeoJsonHexesBounds
}
