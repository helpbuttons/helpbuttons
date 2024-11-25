import { HbMapUncontrolled } from '../';

import { MapTileSelector } from './MapTileSelector';
import t from 'i18n';
import { BrowseType } from '../Map.consts';
import { MarkerButtonIcon } from '../MarkerButton';
import { makeImageUrl } from 'shared/sys.helper';
export function NetworkMapConfigure({
  mapSettings,
  onBoundsChanged,
  setMapTile,
  handleMapClick,
  marker,
  setBrowseType,
  tileType,
  markerColor
}) {
  return (
    <>
      {/* <RadiusSelector
        slider={mapSettings.slider}
        radius={mapSettings.radius}
        polygon={mapSettings.geometry.coordinates[0]}
      /> */}

      {/* <BrowseTypeSelector
        setBrowseType={setBrowseType}
      /> */}
      <div className='form__field'>
         <p className='form__explain'>
           {t('configuration.centerOfMap')}
        </p>
      </div>

      {(mapSettings.browseType != BrowseType.LIST) && 

      <div className="picker__map">
        <HbMapUncontrolled
          onBoundsChanged={onBoundsChanged}
          mapCenter={mapSettings.center}
          mapZoom={mapSettings.zoom}
          width={'100%'}
          height={'18rem'}
          tileType={mapSettings.tileType}
          handleMapClick={handleMapClick}
        >
          {/* {(mapSettings.browseType == BrowseType.HONEYCOMB && mapSettings.honeyCombFeatures) && 
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
          } */}
            <MarkerButtonIcon
              anchor={mapSettings.center}
              offset={[35, 65]}
              cssColor={markerColor}
              image={makeImageUrl(null)}
              title={marker.caption}
            />
          {/* {(mapSettings.browseType == BrowseType.PINS) && 
              <MarkerButtonIcon
              anchor={mapSettings.center}
              offset={[35, 65]}
              cssColor={'red'}
              image={makeImageUrl(marker.image)}
              title={marker.caption}
            />
          }

          {(mapSettings.browseType == BrowseType.LIST) && 
              <MarkerButtonIcon
              anchor={mapSettings.center}
              offset={[35, 65]}
              cssColor={'red'}
              image={makeImageUrl(marker.image)}
              title={marker.caption}
            />
          } */}

          
          {/*
          TO ACTIVE RADIUS SELECTION:
          <MapRadius geometry={mapSettings.geometry}/>
          */}
        </HbMapUncontrolled>
      </div>
    }

      <MapTileSelector
      setMapTile={setMapTile}
      tileType={tileType}
      />
    </>
  );
}
