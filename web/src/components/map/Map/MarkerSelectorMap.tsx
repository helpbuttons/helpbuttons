import React, { useEffect, useRef, useState } from 'react';
import { HbMapUncontrolled } from '.';
import { GeoJson, Marker } from 'pigeon-maps';
import {
  getZoomResolution,
  latLngToGeoJson,
} from 'shared/honeycomb.utils';
import { MarkerButtonIcon } from './MarkerButton';
import { cellToLatLng, latLngToCell } from 'h3-js';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import t from 'i18n';
import { LoadabledComponent } from 'components/loading';
import {
  hexagonSizeZoom,
  onMarkerPositionChangeZoomTo,
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
  networkMapCenter = null,
}) {
  const [markerHexagonGeoJson, setMarkerHexagonGeoJson] =
    useState(null);
  const [zoom, setZoom] = useState(defaultZoom);
  const [mapCenter, setMapCenter] = useState(null);
  const mapCenterIsReady = useRef(false);
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
  };

  useEffect(() => {
    if (editPosition && mapCenterIsReady.current && markerPosition[0] && markerPosition[1]) {
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
    if (showHexagon) {
      onMapClick(getHexagonCenter(latLng, zoom));
    } else {
      onMapClick(latLng);
    }
  }
  useEffect(() => {
    if (mapCenterIsReady.current) {
      if (showHexagon) {
        let polygons = latLngToGeoJson(
          markerPosition[0],
          markerPosition[1],
          getZoomResolution(hexagonSizeZoom),
        );
        setMarkerHexagonGeoJson(() => polygons);
      } else {
        setMarkerHexagonGeoJson(() => null);
      }
      if (zoom > onMarkerPositionChangeZoomTo) {
        setZoom(() => onMarkerPositionChangeZoomTo);
      }
    } else {
      if (
        networkMapCenter &&
        networkMapCenter[0] &&
        networkMapCenter[1]
      ) {
        mapCenterIsReady.current = true;
        setMapCenter(() => networkMapCenter);
        setZoom(() => defaultZoom);
      }else if(markerPosition[0] && markerPosition[1])
      {
        setMapCenter(() => markerPosition);
        setZoom(() => defaultZoom);
      }
    }
  }, [showHexagon, markerPosition, networkMapCenter]);

  return (
    <>
      <div className="picker__map">
        <LoadabledComponent loading={!mapCenter}>
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
            {!showHexagon && (
              <MarkerButtonIcon
                anchor={markerPosition}
                offset={[35, 65]}
                cssColor={markerColor}
                image={markerImage}
                title={markerCaption}
              />
            )}
          </HbMapUncontrolled>
        </LoadabledComponent>
      </div>
    </>
  );
}
