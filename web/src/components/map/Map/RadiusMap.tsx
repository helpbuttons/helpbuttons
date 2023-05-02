import { GeoJson, Marker, Point } from 'pigeon-maps';
import { useEffect, useState } from 'react';
import { HbMap } from '.';
import FieldNumber from 'elements/Fields/FieldNumber';
import {
  UNITS,
  getHexagonAreaAvg,
} from 'h3-js';

import { FindAddress } from 'state/Explore';
import { GlobalState, store } from 'pages';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { useRef } from 'store/Store';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { StamenMapTypes } from './TileProviders';

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
  height,
  setTileType,
  tileType
}) {
  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  const [showSelectTileType, setShowSelectTileType] = useState<boolean>(false)
  // const [tileType, setTileType] = useState<StamenMapTypes>()
  const updateLocation = (newLatLng) => {
    setAddress('...');
    store.emit(
      new FindAddress(
        JSON.stringify({
          apikey: config.mapifyApiKey,
          address: newLatLng.join('+'),
        }),
        (place) => {
          const village = place.results[0].components.village
            ? place.results[0].components.village
            : place.results[0].components.city;
          const address = `${village ? village : ''} ${
            place.results[0].components.county
          }, ${place.results[0].components.country}`;

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
    setZoom(Math.floor(zoom));
  };

  const handleClick = ({ event, latLng, pixel }) => {
    updateSelectedHex(latLng, radius);
    updateLocation(latLng);
  };

  const updateSelectedHex = (center, radius) => {
    const resolution = radius;
    updateAreaSelected(center, resolution);
  };

  useEffect(() => {
    if(!geoJsonData)
    {
      updateAreaSelected(center, radius);
    }
  }, [geoJsonData])
  return (
    <>
      <FieldNumber
        handleChange={(name, value) => {
          updateSelectedHex(center, value);
          setRadius(value);
        }}
        label={'radius'}
        name={'radius'}
        value={radius}
        validationError={undefined}
      />{' '}
      {Math.floor(getHexagonAreaAvg(radius, UNITS.km2) * 100) / 100}{' '}
      km2
      
      <Btn
        btnType={BtnType.splitIcon}
        caption={'change tiles type'}
        contentAlignment={ContentAlignment.center}
        // onClick={handleSubmit(onSmtpTest)}
        onClick={(e) => {e.preventDefault(); setShowSelectTileType(!showSelectTileType)}}
        />
        {showSelectTileType && 
        <div>
      <Btn
        btnType={BtnType.splitIcon}
        caption={'osm'}
        contentAlignment={ContentAlignment.center}
        // onClick={handleSubmit(onSmtpTest)}
        onClick={(e) => {e.preventDefault(); setTileType(null)}}
        />
        <Btn
        btnType={BtnType.splitIcon}
        caption={'terrain'}
        contentAlignment={ContentAlignment.center}
        // onClick={handleSubmit(onSmtpTest)}
        onClick={(e) => {e.preventDefault(); setTileType(StamenMapTypes.TERRAIN)}}
        />
        <Btn
        btnType={BtnType.splitIcon}
        caption={'toner'}
        contentAlignment={ContentAlignment.center}
        // onClick={handleSubmit(onSmtpTest)}
        onClick={(e) => {e.preventDefault(); setTileType(StamenMapTypes.TONER)}}
        />
        <Btn
        btnType={BtnType.splitIcon}
        caption={'watercolor'}
        contentAlignment={ContentAlignment.center}
        // onClick={handleSubmit(onSmtpTest)}
        onClick={(e) => {e.preventDefault(); setTileType(StamenMapTypes.WATERCOLOR)}}
        />
      </div>
    }
      
      <HbMap
        mapCenter={center}
        defaultZoom={defaultZoom}
        handleBoundsChange={boundsChange}
        handleMapClick={handleClick}
        setMapCenter={setCenter}
        width={width}
        height={height}
        tileType={tileType}
      >
        {geoJsonData && (
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
          />
        )}
      </HbMap>
    </>
  );
}
