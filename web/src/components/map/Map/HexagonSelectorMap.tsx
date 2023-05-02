import React, { useEffect, useState } from 'react';
import { MarkerButtonIcon } from './MarkerButton';
import { makeImageUrl } from 'shared/sys.helper';
import { HbMap } from '.';
import DebugToJSON from 'elements/Debug';
import {
  convertBoundsToGeoJsonHexagons,
  convertBoundsToGeoJsonPolygon,
  convertHexesToGeoJson,
  featuresToGeoJson,
  getBottomHexes,
  getDegreesBleed,
  getResolution,
  hideHex,
  showHex,
} from 'shared/honeycomb.utils';
import { latLngToCell, cellToParent, cellToChildren, cellToLatLng } from 'h3-js';
import FieldRadio from 'elements/Fields/FieldRadio';
import FieldRadioOption from 'elements/Fields/FieldRadio/option';
import { Bounds, GeoJson, GeoJsonFeature, Map, Marker, Point, ZoomControl } from 'pigeon-maps';

export default function HexagonSelectorMap({
  updateAreaSelected,
  defaultCenter = [0, 0],
  defaultZoom = 11,
  setCenter,
  setZoom,
}) {
  const [selectedHexs, setSelectedHexs] = useState<string[]>([]);
  const [boundsFeatures, setBoundsFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const updateFeatures = (newSelectedHexes, newBoundsFeatures, resolution) => {
    const resolutionNewSelectedHexes = newSelectedHexes.map((selectedHex) => cellToParent(selectedHex, resolution))
    setSelectedFeatures(
      newBoundsFeatures.filter((feature) => {
        if (resolutionNewSelectedHexes.indexOf( feature.properties.hex) > -1) {
          return true;
        }
        return false;
      })
    )

  };

  const onBoundsChanged = ({ center, zoom, bounds }) => {
    let resolution = getResolution(zoom)
    const hexagons = convertBoundsToGeoJsonHexagons(
      bounds,
      resolution,
    );
    
    const newBoundsFeatures = convertHexesToGeoJson(hexagons, resolution)
    setBoundsFeatures(newBoundsFeatures);
    updateFeatures(selectedHexs,newBoundsFeatures, resolution);
  };


  const handleGeoJsonClick = ({event, anchor, payload}) => {
    
    const clickedHex = payload.properties.hex 
    const clickedResolution = payload.properties.resolution
    const newSelectedHexes = hideHex(clickedHex, clickedResolution, selectedHexs);
    setSelectedHexs(newSelectedHexes)
    updateFeatures(newSelectedHexes, boundsFeatures, clickedResolution)
    console.log(newSelectedHexes)
    console.log(selectedHexs)
  }

  const handleClickOnSelectedHex = ({event, anchor, payload}) => {
    
    const clickedHex = payload.properties.hex 
    const clickedResolution = payload.properties.resolution

    const newSelectedHexes = showHex(clickedHex, clickedResolution, selectedHexs);
    setSelectedHexs(newSelectedHexes)
    updateFeatures(newSelectedHexes,  boundsFeatures,clickedResolution)
  }

  return (
    <>
      <SelectionMap
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        setCenter={setCenter}
        setZoom={setZoom}
        handleBoundsChange={onBoundsChanged}
        width={'60vw'}
        height={'60vh'}
      >
         <GeoJson
        data={featuresToGeoJson(boundsFeatures)}
        onClick={handleGeoJsonClick}

        styleCallback={(feature, hover) => {
          if(hover)
          {
            return {
              fill: "#ffdd028c",
              strokeWidth: "0.3",
              stroke: "#ffdd02ff",
              r: "20",
            };
          }
          return {
            fill: "#d4e6ec11",
            strokeWidth: "0.3",
            stroke: "#ffdd02ff",
            r: "20",
          };
        }}
      />
      <GeoJson
        data={featuresToGeoJson(selectedFeatures)}
        onClick={handleClickOnSelectedHex}
        styleCallback={(feature, hover) => {
          if(hover)
          {
            return {
              fill: "#ffdd028c",
              strokeWidth: "0.3",
              stroke: "#ffdd02ff",
              r: "20",
            };
          }
          return {
            fill: "#ff3702aa",
            opacity: '80',
            strokeWidth: "0.3",
            stroke: "#ffdd02ff",
            r: "20",
          };
        }}
      /> 
      
      </SelectionMap>

    </>
  );
}


export function SelectionMap({
  children,
  defaultCenter,
  setCenter,
  setZoom,
  defaultZoom,
  handleBoundsChange,
  width = null,
  height = null,
}) {
  const [internalCenter, setInternalCenter] =
    useState<Point>(defaultCenter);
  const [internalZoom, setInternalZoom] = useState(defaultZoom);

  const [rectBounds,setRectBounds] = useState()
  const [expRectBounds,setExpRectBounds] = useState()

  return (
    <>
      <Map
        minZoom={4}
        maxZoom={16}
        height={height}
        width={width}
        center={internalCenter}
        defaultZoom={16}
        onBoundsChanged={({ center, zoom,bounds }) => {
          
          const flooredZoom =Math.floor(zoom);
          console.log(`zoom : ${zoom} -> ${flooredZoom}`)
          setInternalCenter(center);
          setInternalZoom(flooredZoom);
          setCenter(center);
          setZoom(flooredZoom);

          const bleededBounds = getDegreesBleed(zoom, bounds);
          handleBoundsChange({center,zoom: flooredZoom,bounds: bleededBounds})

        }}
      >
    
        {children}
        <ZoomControl />
      </Map>
    </>
  );
}
