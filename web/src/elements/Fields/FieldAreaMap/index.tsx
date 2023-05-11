//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';

import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import t from 'i18n';
import { cellToLatLng, latLngToCell } from 'h3-js';
import {
  convertHexesToFeatures,
  featuresToGeoJson,
  roundCoords,
} from 'shared/utils/honeycomb.utils';
import { NetworkEditMap } from 'components/map/Map/NetworkEditMap';
export default function FieldAreaMap({
  validationError,
  setArea,
  zoom,
  defaultCenter,
  setZoom,
  setLatitude,
  setLongitude,
  setTileType,
  tileType,
  setResolution,
  resolution
}) {

  const [showHideMenu, setHideMenu] = useState(false);
  const [center, setCenter] = useState(defaultCenter);
  const [geoJsonData, setGeoJsonData] = useState(null);

  const handleSelectedPlace = (place) => {
    setCenter([place.geometry.lat, place.geometry.lng]);
    const hex = updateJsonData(
      [place.geometry.lat, place.geometry.lng],
      resolution,
    );
    setArea({ hex, resolution: resolution });
  };

  const updateJsonData = (center, resolution) => {
    const hex = latLngToCell(center[0], center[1], resolution);
    setGeoJsonData(
      featuresToGeoJson(convertHexesToFeatures([hex], resolution)),
    );
    center = roundCoords(center)
    setLatitude(center[0])
    setLongitude(center[1])

    setCenter(cellToLatLng(hex));
    return hex;
  };

  return (
    <>
      <div className="form__field">
        <div
          className="btn"
          onClick={() => setHideMenu(!showHideMenu)}
        >
          {t('button.changePlace')}
        </div>
      </div>
      {showHideMenu && (
        <div className="picker__close-container">
          <div className="picker--over picker-box-shadow picker__content picker__options-v">
            <NetworkEditMap
              updateAreaSelected={(center, resolution) => {
                const hex = updateJsonData(center, resolution);
                setArea({ hex, resolution });
              }}
              center={center}
              setCenter={setCenter}
              geoJsonData={geoJsonData}
              resolution={resolution}
              setResolution={setResolution}
              zoom={zoom}
              setZoom={setZoom}
              width={'60vw'}
              height={'40vh'}
              setTileType={setTileType}
              tileType={tileType}
            />
            <DropDownSearchLocation
              placeholder={t('homeinfo.searchlocation')}
              handleSelectedPlace={handleSelectedPlace}
            />
            <Btn
              btnType={BtnType.splitIcon}
              caption={t('common.save')}
              contentAlignment={ContentAlignment.center}
              onClick={() => setHideMenu(!showHideMenu)}
            />
          </div>

          <div
            className="picker__close-overlay"
            onClick={() => setHideMenu(false)}
          ></div>
        </div>
      )}
      <span style={{ color: 'red' }}>{validationError}</span>
    </>
  );
}
