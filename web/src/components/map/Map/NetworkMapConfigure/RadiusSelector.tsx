import Slider from 'rc-slider';
import { getAreaOfPolygon } from 'geolib';
import 'rc-slider/assets/index.css';
import { GeoJson, GeoJsonFeature } from 'pigeon-maps';

export function RadiusSelector({ slider, radius, polygon }) {
  return (
    <>
      <Slider {...slider} radius={radius} />
      Area
      {Math.floor(getAreaOfPolygon(polygon) / 10000) / 100}
      km²
    </>
  );
}

export function MapRadius({geometry})
{
    return (
        <GeoJson
          svgAttributes={{
            fill: '#d4e6ec99',
            strokeWidth: '1',
            stroke: 'white',
            r: '20',
          }}
        >
          <GeoJsonFeature
            feature={{
              type: 'Feature',
              geometry: geometry,
              properties: { prop0: 'value0' },
            }}
          />
        </GeoJson>
    )
}
