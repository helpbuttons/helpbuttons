import { HbMapUncontrolled } from '../';

import { MapTileSelector } from './MapTileSelector';
import t from 'i18n';
import { BrowseTypeSelector } from './BrowseTypeSelector';
import { BrowseType } from '../Map.consts';
import { GeoJson, GeoJsonFeature } from 'pigeon-maps';
import { MarkerButtonIcon } from '../MarkerButton';
import { makeImageUrl } from 'shared/sys.helper';
import { useEffect, useRef, useState } from 'react';
import { getBoundsHexFeatures, getZoomResolution } from 'shared/honeycomb.utils';
import { alertService } from 'services/Alert';
export function NetworkMapConfigure({
  mapSettings
}) {
  return (
    <>
      <div className='form__field'>
         <p className='form__explain'>
           {t('configuration.centerOfMap')}
        </p>
      </div>

      {(mapSettings.browseType != BrowseType.LIST) && 

      <div className="picker__map">
        <HexagonAreaSelection mapSettings={mapSettings}/>
      </div>
    }

      
    </>
  );
}


export function HexagonAreaSelection({mapSettings})
{
  const [selectedHexagons, setSelectedHexagons] = useState([])
  const [allHexagons, setAllHexagons] = useState([])
  const prevZoom = useRef(mapSettings.zoom)
  const prevBounds = useRef(null)

  const onBoundsChanged = ({ center, zoom, bounds }) => {
    console.log('updating bounds...')
    // h3.polygonToCells(polygon, res);
    if(selectedHexagons.length > 0){
      if(getZoomResolution(prevZoom.current) != getZoomResolution(zoom))
      {
        alertService.warn('When in selection mode, if you change the zoom your selection is cleared.')
        setSelectedHexagons(() => [])
      }
      // if(prevBounds.current && prevBounds.current != bounds)
      // {
      //   alertService.warn('When in selection mode, if you change the zoom your selection is cleared.')
      //   setSelectedHexagons(() => [])
      // }
    }
    prevBounds.current = bounds
    setAllHexagons(() => getBoundsHexFeatures(bounds, zoom))
  }
  return (<>
  <HbMapUncontrolled onBoundsChanged={onBoundsChanged} mapCenter={mapSettings.center} mapZoom={mapSettings.zoom} width={'100%'} height={'18rem'}>
  <GeoJson onContextMenu={() => console.log('fail')}>
                {allHexagons.map((hexagonFeature) => (
                  <GeoJsonFeature
                    onClick={(event) => {
                      
                      const clickedHex = event.payload.properties.hex
                      setSelectedHexagons((prevSelected) => {
                        console.log(prevSelected)
                        const index = prevSelected.indexOf(clickedHex);
                        if (index > -1) {
                          prevSelected.splice(index, 1);
                        }else{
                          prevSelected.push(clickedHex)
                        }
                        return prevSelected
                      })
                    }}
                    feature={hexagonFeature}
                    key={hexagonFeature.properties.hex}
                    styleCallback={(feature, hover) => {
                      const drawHex = feature.properties.hex;
                      if(selectedHexagons.find((hex) => drawHex == hex))
                      {
                        return {
                          fill: 'black',
                          strokeWidth: '2',
                          stroke: '#18AAD2',
                          r: '20',
                          opacity: '0.4',
                        };
                      }
                      if (hover) {
                        return {
                          fill: '#18AAD2',
                          strokeWidth: '4',
                          stroke: '#18AAD2',
                          r: '20',
                          opacity: 0.8,
                        };
                      }
                        return {
                          fill: 'transparent',
                          strokeWidth: '1',
                          stroke: '#18AAD2',
                          r: '20',
                          opacity: 0.1,
                        };
                      }
                    }
                  />
                ))}

              </GeoJson>
  </HbMapUncontrolled>
  </>);
}

export function CenterSelection({onBoundsChanged, mapSettings,  markerColor, marker, handleMapClick})
{
  return (<HbMapUncontrolled
          onBoundsChanged={onBoundsChanged}
          mapCenter={mapSettings.center}
          mapZoom={mapSettings.zoom}
          width={'100%'}
          height={'18rem'}
          tileType={mapSettings.tileType}
          handleMapClick={handleMapClick}
        >
            <MarkerButtonIcon
              anchor={mapSettings.center}
              offset={[35, 65]}
              cssColor={markerColor}
              image={makeImageUrl(marker.image)}
              title={marker.caption}
            />
          {/*
          TO ACTIVE RADIUS SELECTION:
          <MapRadius geometry={mapSettings.geometry}/>
          */}
        </HbMapUncontrolled>);
}