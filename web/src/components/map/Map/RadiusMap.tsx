import { GeoJson, Marker, Point } from 'pigeon-maps';
import { useEffect, useState } from 'react';
import { HbMap } from '.';
import FieldNumber from 'elements/Fields/FieldNumber';
import { UNITS, cellToLatLng, getHexagonAreaAvg, latLngToCell } from 'h3-js';
import { convertHexesToGeoJson, featuresToGeoJson } from 'shared/honeycomb.utils';
import { FindAddress } from 'state/Explore';
import { GlobalState, store } from 'pages';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { useRef } from 'store/Store';

export function RadiusMap({
  center,
  setCenter,
  defaultZoom,
  updateAreaSelected,
  setAddress,
  geoJsonData,
  radius,
  setRadius,
  setZoom,
  width,
  height
}) {
  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  
  const updateLocation = (newLatLng) => {
    setAddress('...')
    store.emit(
      new FindAddress(
        JSON.stringify({
          apikey: config.mapifyApiKey,
          address: newLatLng.join('+'),
        }),
        (place) => {
            const village = place.results[0].components.village ? place.results[0].components.village : place.results[0].components.city
          const address = `${village ? village : ''} ${place.results[0].components.county}, ${place.results[0].components.country}`;
            
          setAddress(address);
        },
        () => {
          console.log(
            'error, no address found, mapifyapi not configured?',
          );
        },
      ),
    );
  };

  const boundsChange = ({ center, zoom, bounds }) => {
    setZoom(zoom)
  };

  const handleClick = ({ event, latLng, pixel }) => {
    updateSelectedHex(latLng, radius)
    updateLocation(latLng)
  }

  const updateSelectedHex = (center, radius) => 
  {
    const resolution = radius;
    updateAreaSelected(center, resolution);
  }

  return (
    <>
      <FieldNumber
        handleChange={(name, value) => {
          updateSelectedHex(center, value)
          setRadius(value)
        }}
        label={'radius'}
        name={'radius'}
        value={radius}
        validationError={undefined}
      />    {Math.floor(getHexagonAreaAvg(radius, UNITS.km2) * 100) / 100} km2

      <HbMap
        mapCenter={center}
        defaultZoom={defaultZoom}
        handleBoundsChange={boundsChange}
        handleMapClick={handleClick}
        setMapCenter={setCenter}
        width={width}
        height={height}
      >
        {geoJsonData && 
        <GeoJson
          data={geoJsonData}
          styleCallback={(feature, hover) => {
            if (feature.geometry.type === 'LineString') {
              return { strokeWidth: '1', stroke: 'black' };
            }
            return {
              fill: '#ffea02aa',
              strokeWidth: '1',
              stroke: 'white',
              r: '10',
            };
          }}
        />} 
      </HbMap>
    </>
  );
}
