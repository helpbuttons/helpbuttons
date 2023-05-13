import { GeoJson, Marker, Point } from 'pigeon-maps';
import { useEffect, useState } from 'react';
import { HbMap } from '.';
import FieldNumber from 'elements/Fields/FieldNumber';
import {
  UNITS,
  getHexagonAreaAvg,
} from 'h3-js';

import { GlobalState, store } from 'pages';
import { SetupDtoOut } from 'shared/entities/setup.entity';
import { useRef } from 'store/Store';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { HbMapTiles } from './TileProviders';

export function NetworkEditMap({
  center,
  setCenter,
  zoom,
  updateAreaSelected,
  geoJsonData,
  resolution,
  setResolution,
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
  const handleClick = ({ event, latLng, pixel }) => {
    updateSelectedHex(latLng, resolution);
  };

  const updateSelectedHex = (center, radius) => {
    const resolution = radius;
    updateAreaSelected(center, resolution);
  };

  useEffect(() => {
    if(!geoJsonData)
    {
      updateAreaSelected(center, resolution);
    }
  }, [geoJsonData])
  return (
    <>
      <FieldNumber
        handleChange={(name, value) => {
          updateSelectedHex(center, value);
          setResolution(value);
        }}
        label={'resolution'}
        name={'resolution'}
        value={resolution}
        validationError={undefined}
      />{' '}
      {Math.floor(getHexagonAreaAvg(resolution, UNITS.km2) * 100) / 100}{' '}
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
        onClick={(e) => {e.preventDefault(); setTileType( HbMapTiles.OSM)}}
        />
        <Btn
        btnType={BtnType.splitIcon}
        caption={'terrain'}
        contentAlignment={ContentAlignment.center}
        // onClick={handleSubmit(onSmtpTest)}
        onClick={(e) => {e.preventDefault(); setTileType(HbMapTiles.TERRAIN)}}
        />
        <Btn
        btnType={BtnType.splitIcon}
        caption={'toner'}
        contentAlignment={ContentAlignment.center}
        // onClick={handleSubmit(onSmtpTest)}
        onClick={(e) => {e.preventDefault(); setTileType(HbMapTiles.TONER)}}
        />
        <Btn
        btnType={BtnType.splitIcon}
        caption={'watercolor'}
        contentAlignment={ContentAlignment.center}
        // onClick={handleSubmit(onSmtpTest)}
        onClick={(e) => {e.preventDefault(); setTileType(HbMapTiles.WATERCOLOR)}}
        />
      </div>
    }
      
      <HbMap
        mapCenter={center}
        mapZoom={zoom}
        setMapZoom={setZoom}
        handleMapClick={handleClick}
        setMapCenter={setCenter}
        width={width}
        height={height}
        forceTileType={tileType}
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
