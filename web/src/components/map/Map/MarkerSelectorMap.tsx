import React, { useEffect, useState } from 'react';
import { HbMapUncontrolled } from '.';
import { GeoJson, Point } from 'pigeon-maps';
import {
  getZoomResolution,
  latLngToGeoJson,
} from 'shared/honeycomb.utils';
import { MarkerButtonIcon } from './MarkerButton';
import { cellToLatLng, latLngToCell } from 'h3-js';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import t from 'i18n';
import { LoadabledComponent } from 'components/loading';
import { useToggle } from 'shared/custom.hooks';
import {
  hexagonSizeZoom,
  maxZoom,
  showMarkerInHexagonMaxZoom,
} from './Map.consts';

export function MarkerEditorMap(props) {
  return (
    <>
      <DropDownSearchLocation
        placeholder={t('homeinfo.searchlocation')}
        handleSelectedPlace={props.handleSelectedPlace}
        address={props.markerAddress}
        loadingNewAddress={props.loadingNewAddress}
      />
      <MarkerViewMap {...props} editPosition={true} />
    </>
  );
}

export default function MarkerViewMap({
  markerPosition,
  defaultZoom,
  markerColor,
  markerImage,
  markerCaption,
  showHexagon = false,
  editPosition = false,
  onMapClick = (latLng) => {},
  networkMapCenter = [0, 0],
}) {
  const [markerHexagonGeoJson, setMarkerHexagonGeoJson] =
    useState(null);
  const [zoom, setZoom] = useState(defaultZoom);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapCenterIsReady, toggleMapCenterIsReady] = useToggle(false);
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    console.log('bounds changed...');
    // setMarkerPosition(center);
    if (editPosition) {
      setMapCenter(() => center);
    }
    setZoom(() => zoom);
  };

  useEffect(() => {
    if (editPosition) {
      setMapCenter(() => markerPosition);
    }
  }, [markerPosition]);
  const getHexagonCenter = (latLng, zoom) => {
    const cell = latLngToCell(
      latLng[0],
      latLng[1],
      getZoomResolution(zoom),
    );
    const center = cellToLatLng(cell);

    return center;
  };
  function handleMapClicked({ latLng }) {
    console.log('map clicked..')
    if (showHexagon) {
      onMapClick(getHexagonCenter(latLng, zoom));
      
    } else {
      onMapClick(latLng);
    }
  }
  useEffect(() => {
    if (showHexagon) {
      let polygons = latLngToGeoJson(
        markerPosition[0],
        markerPosition[1],
        getZoomResolution(hexagonSizeZoom),
      );

      setMarkerHexagonGeoJson(() => polygons);
      if(zoom < showMarkerInHexagonMaxZoom)
      {
        setZoom(() => showMarkerInHexagonMaxZoom)
      }
    }else{
      setMarkerHexagonGeoJson(() => null);
    }
  }, [showHexagon, markerPosition])

  useEffect(() => {
    if (!mapCenterIsReady) {
      if (!markerPosition[0] || !markerPosition[1]) {
        setMapCenter(() => networkMapCenter);
        setZoom(() => defaultZoom);
        toggleMapCenterIsReady(true);
      } else {
        setZoom(() => maxZoom);
        setMapCenter(() => markerPosition);
        toggleMapCenterIsReady(true);
      }
    }
  }, []);

  return (
    <>
      <div className="picker__map">
        <LoadabledComponent loading={!mapCenterIsReady}>
          <HbMapUncontrolled
            mapCenter={mapCenter}
            mapZoom={zoom}
            onBoundsChanged={onBoundsChanged}
            handleMapClick={handleMapClicked}
            width={'100%'}
            height={'16rem'}
          >
            {showHexagon && (
              <GeoJson
                data={markerHexagonGeoJson}
                styleCallback={(feature, hover) => {
                  return { fill: markerColor, opacity: 0.4 };
                }}
              />
            )}
            {!showHexagon &&
              <MarkerButtonIcon
                anchor={markerPosition}
                offset={[35, 65]}
                cssColor={markerColor}
                image={markerImage}
                title={markerCaption}
              />
            }
          </HbMapUncontrolled>
        </LoadabledComponent>
      </div>
    </>
  );
}
