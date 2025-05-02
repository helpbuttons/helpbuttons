const turf = require('@turf/turf'); // if you're in NodeJS

export function circleGeoJSON(longitude, latitude, radiusInMeters, steps = 30) {
  const center = [longitude, latitude]; 
  return turf.circle(center, radiusInMeters, {steps: steps});
}
