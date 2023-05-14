import { GeoJson, GeoJsonFeature} from 'pigeon-maps';
import { useState } from 'react';
import { HbMap } from '.';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { HbMapTiles } from './TileProviders';
import { MarkerButtonIcon } from './MarkerButton';
import { makeImageUrl } from 'shared/sys.helper';
import Slider from 'rc-slider';
import { getAreaOfPolygon } from 'geolib';

import 'rc-slider/assets/index.css';

export function NetworkEditMap({
  mapSettings,
  onBoundsChanged,
  setMapTile,
  handleMapClick,
}) {
  const [showSelectTileType, setShowSelectTileType] =
    useState<boolean>(false);

  return (
    <>
      <Slider {...mapSettings.slider} radius={mapSettings.radius} />
      Area
      {Math.floor(
        getAreaOfPolygon(mapSettings.geometry.coordinates[0]) / 10000,
      ) / 100}
      km²
      <Btn
        btnType={BtnType.splitIcon}
        caption={'change tiles type'}
        contentAlignment={ContentAlignment.center}
        // onClick={handleSubmit(onSmtpTest)}
        onClick={(e) => {
          e.preventDefault();
          setShowSelectTileType(!showSelectTileType);
        }}
      />
      {showSelectTileType && (
        <div>
          <Btn
            btnType={BtnType.splitIcon}
            caption={'osm'}
            contentAlignment={ContentAlignment.center}
            // onClick={handleSubmit(onSmtpTest)}
            onClick={(e) => {
              e.preventDefault();
              setMapTile(HbMapTiles.OSM);
            }}
          />
          <Btn
            btnType={BtnType.splitIcon}
            caption={'terrain'}
            contentAlignment={ContentAlignment.center}
            // onClick={handleSubmit(onSmtpTest)}
            onClick={(e) => {
              e.preventDefault();
              setMapTile(HbMapTiles.TERRAIN);
            }}
          />
          <Btn
            btnType={BtnType.splitIcon}
            caption={'toner'}
            contentAlignment={ContentAlignment.center}
            // onClick={handleSubmit(onSmtpTest)}
            onClick={(e) => {
              e.preventDefault();
              setMapTile(HbMapTiles.TONER);
            }}
          />
          <Btn
            btnType={BtnType.splitIcon}
            caption={'watercolor'}
            contentAlignment={ContentAlignment.center}
            // onClick={handleSubmit(onSmtpTest)}
            onClick={(e) => {
              e.preventDefault();
              setMapTile(HbMapTiles.WATERCOLOR);
            }}
          />
        </div>
      )}
      {mapSettings.tileType}
      <HbMap
        onBoundsChanged={onBoundsChanged}
        mapCenter={mapSettings.center}
        mapZoom={mapSettings.zoom}
        width={'60vw'}
        height={'60vh'}
        tileType={mapSettings.tileType}
        handleMapClick={handleMapClick}
      >
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
              geometry: mapSettings.geometry,
              properties: { prop0: 'value0' },
            }}
          />
        </GeoJson>
        <MarkerButtonIcon
          anchor={mapSettings.center}
          offset={[35, 65]}
          cssColor={'red'}
          image={makeImageUrl(mapSettings.marker.image, '/api')}
          title={mapSettings.marker.caption}
        />
      </HbMap>
    </>
  );
}
