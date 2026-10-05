import { cellToParent } from "h3-js";
import _ from "lodash";
import {hexesProvincesMaxResolution } from "shared/provinces.consts.cjs"
export const provincesMaxZoom = 9;

export const provincesH3GeoJson = require('../../../../public/geo/provinces_h3.json')

export function findVisibleProvincesHexes(boundsHexes, hexes, resolution) {
  
    let allBoundsHexOnRes = boundsHexes;
    if (hexesProvincesMaxResolution > resolution){
      allBoundsHexOnRes = _.uniq(hexes.flatMap((cell) => {
          return cellToParent(cell, hexesProvincesMaxResolution)
        }));
    }
    return allBoundsHexOnRes;
  }