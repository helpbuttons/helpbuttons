import { HbMap } from '../';

import { MapTileSelector } from './MapTileSelector';
import t from 'i18n';
import { BrowseTypeSelector } from './BrowseTypeSelector';
import { BrowseType } from '../Map.consts';
import { GeoJson } from 'pigeon-maps';
import { MarkerButtonIcon } from '../MarkerButton';
import { makeImageUrl } from 'shared/sys.helper';
export function NetworkMapConfigure({
  mapSettings,
  onBoundsChanged,
  setMapTile,
  handleMapClick,
  marker,
  setBrowseType,
}) {

  return (
    <>
      {mapSettings.center}
      {/* <RadiusSelector
        slider={mapSettings.slider}
        radius={mapSettings.radius}
        polygon={mapSettings.geometry.coordinates[0]}
      /> */}
      <MapTileSelector
        setMapTile={setMapTile}
      />
      <BrowseTypeSelector
        setBrowseType={setBrowseType}
      />
      {t('configure.centerOfMap')}
      {(mapSettings.browseType != BrowseType.LIST) && 
      <HbMap
        onBoundsChanged={onBoundsChanged}
        mapCenter={mapSettings.center}
        mapZoom={mapSettings.zoom}
        width={'60vw'}
        height={'60vh'}
        tileType={mapSettings.tileType}
        handleMapClick={handleMapClick}
      >
        {(mapSettings.browseType == BrowseType.HONEYCOMB && mapSettings.honeyCombFeatures) && 
            <GeoJson
            data={mapSettings.honeyCombFeatures}
            onClick={(feature) => {
              console.log(feature.payload.properties.hex);
            }}
            styleCallback={(feature, hover) => {
              if (hover) {
                return {
                  fill: '#ffdd028c',
                  strokeWidth: '0.3',
                  stroke: '#ffdd02ff',
                  r: '20',
                };
              }
              return {
                fill: '#d4e6ec11',
                strokeWidth: '0.3',
                stroke: '#ffdd02ff',
                r: '20',
              };
            }}
          />
        }

        {(mapSettings.browseType == BrowseType.PINS) && 
            <MarkerButtonIcon
            anchor={mapSettings.center}
            offset={[35, 65]}
            cssColor={'red'}
            image={makeImageUrl(marker.image, '/api')}
            title={marker.caption}
          />
        }

        {(mapSettings.browseType == BrowseType.LIST) && 
            <MarkerButtonIcon
            anchor={mapSettings.center}
            offset={[35, 65]}
            cssColor={'red'}
            image={makeImageUrl(marker.image, '/api')}
            title={marker.caption}
          />
        }

        
        {/*
        TO ACTIVE RADIUS SELECTION:
        <MapRadius geometry={mapSettings.geometry}/>
         */}
      </HbMap>
    }
    </>
  );
}
