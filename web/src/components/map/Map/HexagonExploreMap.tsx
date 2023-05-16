import React, { useEffect, useState } from 'react';
import { GeoJson, Overlay } from 'pigeon-maps';
import { Button } from 'shared/entities/button.entity';
import { MarkerButton, MarkerButtonPopup } from './MarkerButton';
import { store } from 'pages';
import {
  updateCurrentButton,
} from 'state/Explore';
import { HbMap } from '.';
import { convertH3DensityToFeatures, featuresToGeoJson, getBoundsHexFeatures, getResolution } from 'shared/honeycomb.utils';
import { cellToParent } from 'h3-js';
import _ from 'lodash';

export default function HexagonExploreMap({
  filteredButtons,
  currentButton,
  handleBoundsChange,
  exploreSettings,
  setMapCenter
}) {
  const [boundsFeatures, setBoundsFeatures] = useState(featuresToGeoJson([]));
  const [h3ButtonsDensityFeatures, setH3ButtonsDensityFeatures] = useState([])
  const onBoundsChanged = ({ center, zoom, bounds }) => {
    setBoundsFeatures(() => {return getBoundsHexFeatures(bounds,zoom)})
    handleBoundsChange(bounds, center, zoom);
  };

  const handleMarkerClicked = (button: Button) => {
    setMapCenter([button.latitude, button.longitude]);
    store.emit(new updateCurrentButton(button));
  };
  const handleMapClicked = ({ event, latLng, pixel }) => {
    setMapCenter(latLng);
    store.emit(new updateCurrentButton(null));
  };

  useEffect(() => {
    console.log(`zoom: ${exploreSettings.zoom} - res: ${getResolution(exploreSettings.zoom)}`)
    const hexagonsOnResolution = filteredButtons.map((button) => cellToParent(button.hexagon, getResolution(exploreSettings.zoom)))

    // const getButtonsForBounds = (bounds: Bounds) => {
    //   sub.next(
    //     JSON.stringify({
    //       bounds: bounds,
    //     }),
    //   );
    // };
    /*localStorageService.save(
      LocalStorageVars.EXPLORE_SETTINGS,
      JSON.stringify({ bounds, center, zoom, currentButton }),
    );

    const requestedH3Cells = polygonToCells(
      convertBoundsToPolygon(bounds),
      getResolution(exploreSettings.zoom),
    );

    // console.log(' z:'+mapZoom)
    let contains = (arr, target) =>
      target.every((v) => arr.includes(v));

    const union = _.union(allFetchedBounds, requestedH3Cells).slice(-5000)// maximum allocation of hexagons
    // union = union.slice(5000)
    console.log('union: ' + allFetchedBounds.length + ' ' + union.length)
    setAllFetchedBounds(() => union);
    setFilters(() => {return { ...filters, bounds: bounds }});
    // console.log('contains' + contains(['a','b','c'], ['b','c','d']))
    // debugger;
    // console.log()
    if (contains(allFetchedBounds, requestedH3Cells)) {
      console.log('setting buttons from cache...');
      
      const _boundsButtons = cachedButtons.filter((button) => {
        const hexx =  cellToParent(button.hexagon, getResolution(exploreSettings.zoom));
        const hexxxFromcoords = latLngToCell(button.latitude, button.longitude, getResolution(exploreSettings.zoom))
        // console.log(`is ${hexx} valid? ${h3.isValidCell(hexx)} res: ${h3.getResolution(hexx)}`)
        // if(h3.getResolution(hexx) ==)
        
        const distancess = requestedH3Cells.map((hexing) => {
          console.log(`${hexing} (${h3.getResolution(hexing)})?! ${hexxxFromcoords} ${hexx} (${h3.getResolution(hexx)})`)
          try{
          console.log(`${h3.gridDistance(hexing, hexx)}`)
        }catch(err)
        {
          console.log(err)
        }
          return 0;
          // return h3.gridDistance(hexing, hexx)
        })
        console.log(distancess)
        const res = requestedH3Cells.includes(
          hexx
        );
        return true
      });
      console.log('found buttons: ' + _boundsButtons.length);

      setBoundsButtons(() => _boundsButtons);
    } else {
      console.log('getting buttons from api...');
      getButtonsForBounds(bounds);
    }*/

    setH3ButtonsDensityFeatures(() => convertH3DensityToFeatures(_.groupBy(hexagonsOnResolution)))
  }, [filteredButtons])
  return (
    <> Found : {filteredButtons.length}
    <HbMap
      mapCenter={exploreSettings.center}
      mapZoom={exploreSettings.zoom}
      onBoundsChanged={onBoundsChanged}
      handleMapClick={handleMapClicked}
    >
      
      <GeoJson
              data={boundsFeatures}
              onClick={(feature) => {console.log(feature.payload.properties.hex)}}
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
              <GeoJson
              data={featuresToGeoJson(h3ButtonsDensityFeatures)}
              onClick={(feature) => {console.log(feature.payload)}}
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
                  fill: 'black',
                  opacity: 0.5,
                  strokeWidth: '0.3',
                  stroke: '#ffdd02ff',
                  r: '20',
                };
              }}
            />
            {h3ButtonsDensityFeatures.map((feature) => {
              return (
              <Overlay anchor={feature.properties.center}>
                {feature.properties.count}
             </Overlay>
              )
            })}
             
    </HbMap></>
  );
}
