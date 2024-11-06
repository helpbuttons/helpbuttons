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
import { DropDownWhere } from 'elements/Dropdown/DropDownWhere';

export function MarkerEditorMap(props) {
  return (
    <>
      <DropDownWhere
        handleSelectedPlace={props.handleSelectedPlace}
        placeholder={'im a placeholder'}
        toggleLoadingNewAddress={props.toggleLoadingNewAddress}
        loadingNewAddress={props.loadingNewAddress}
        hideAddress={props.hideAddress}
        markerAddress={props.markerAddress}
        markerPosition={props.markerPosition}
      />
      {/* <DropDownSearchLocation
        placeholder={t('homeinfo.searchlocation')}
        handleSelectedPlace={props.handleSelectedPlace}
        address={props.markerAddress}
        loadingNewAddress={props.loadingNewAddress}
        hideAddress={props.hideAddress}
        toggleLoadingNewAddress={props.toggleLoadingNewAddress}
        markerPosition={props.markerPosition}
      /> */}
      <MarkerViewMap {...props} editPosition={true} />
    </>
  );
}

export default function MarkerViewMap({
  markerPosition,
  zoom,
  setZoom,
  markerColor,
  markerImage,
  markerCaption,
  hideAddress,
  editPosition = false,
  onMapClick = (latLng) => {},
  networkMapCenter = null,
}) {
  const [markerHexagonGeoJson, setMarkerHexagonGeoJson] =
    useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const mapCenterIsReady = useRef(false);
  const onBoundsChanged = ({ center, zoom, bounds, initial }) => {
    setZoom(() => zoom);
    setMapCenter(() => center);
  };

  useEffect(() => {
    if (
      editPosition &&
      mapCenterIsReady.current &&
      markerPosition[0] &&
      markerPosition[1]
    ) {
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
    if (hideAddress) {
      onMapClick(getHexagonCenter(latLng, zoom));
    } else {
      onMapClick(latLng);
    }
  }
  useEffect(() => {
    if (mapCenterIsReady.current) {
      if (hideAddress) {
        let polygons = latLngToGeoJson(
          markerPosition[0],
          markerPosition[1],
          getZoomResolution(hexagonSizeZoom),
        );
        if (zoom < hexagonSizeZoom) {
          setZoom(() => hexagonSizeZoom);
        }
        setMarkerHexagonGeoJson(() => polygons);
      } else {
        setMarkerHexagonGeoJson(() => null);
      }
    } else {
      if (
        networkMapCenter &&
        networkMapCenter[0] &&
        networkMapCenter[1]
      ) {
        mapCenterIsReady.current = true;
        setMapCenter(() => networkMapCenter);
      } else if (markerPosition[0] && markerPosition[1]) {
        setMapCenter(() => markerPosition);
      }
    }
  }, [hideAddress, markerPosition, networkMapCenter]);

  useEffect(() => {
    if (hideAddress) {
      if (zoom > hexagonSizeZoom) {
        setZoom(() => hexagonSizeZoom);
      }
    }
  }, [hideAddress]);
  useEffect(() => {
    // zoom in if markerposition is set, and the user selected a new position, cause if zoom is too far makes no sense.
    if (
      mapCenterIsReady.current &&
      markerPosition[0] &&
      markerPosition[1]
    ) {
      if (zoom < onMarkerPositionChangeZoomTo) {
        setZoom(() => zoom + 2);
      }
    }
  }, [markerPosition]);
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
            {hideAddress && (
              <GeoJson
                data={markerHexagonGeoJson}
                styleCallback={(feature, hover) => {
                  return { fill: markerColor, opacity: 0.4 };
                }}
              />
            )}
            {!hideAddress && (
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
