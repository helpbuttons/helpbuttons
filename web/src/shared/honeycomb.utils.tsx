import { Bounds } from 'pigeon-maps';
import {
  cellToChildren,
} from 'h3-js';
import { featureToH3Set, h3SetToFeature } from 'geojson2h3';
import { min } from 'class-validator';
import _ from 'lodash';

export const maxResolution = 10;

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


function convertBoundsToPolygon(bounds: Bounds) {
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

export function convertHexesToGeoJson(
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
      },
    };
  });
}

export function getDegreesBleed(zoom: number, bounds: Bounds) : Bounds
{
  console.log(bounds)
  let extende = 0.001;
  if (zoom < 5) {
    extende = 3
  } else if (Math.abs(zoom - 5) < 3) {
    extende = 1.5
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
  if (zoom > 14) {
    return maxResolution;
  } else if (zoom > 13) {
    return maxResolution - 1;
  } else if (zoom > 11) {
    return maxResolution - 2;
  } else if (zoom > 10) {
    return maxResolution - 3;
  } else if (zoom > 8) {
    return maxResolution - 4;
  } else if (zoom > 7) {
    return maxResolution - 5;
  } else if (zoom > 6) {
    return maxResolution - 6;
  } else if (zoom > 4) {
    return maxResolution - 7;
  } else if (zoom > 3) {
    return maxResolution - 8;
  }
  return 1;
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