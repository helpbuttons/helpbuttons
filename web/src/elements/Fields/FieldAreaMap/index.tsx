//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';

import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import t from 'i18n';
import { RadiusMap } from 'components/map/Map/RadiusMap';
import { cellToLatLng, latLngToCell } from 'h3-js';
import {
  convertHexesToGeoJson,
  featuresToGeoJson,
  roundCoords,
} from 'shared/honeycomb.utils';
export default function FieldAreaMap({
  validationError,
  setArea,
  defaultZoom,
  defaultCenter,
  setAddress,
  address,
  setZoom,
  setLatitude,
  setLongitude,
}) {
  const [showHideMenu, setHideMenu] = useState(false);
  const [center, setCenter] = useState(defaultCenter);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [radius, setRadius] = useState(6);

  const handleSelectedPlace = (place) => {
    setCenter([place.geometry.lat, place.geometry.lng]);
    const hex = updateJsonData(
      [place.geometry.lat, place.geometry.lng],
      radius,
    );
    setArea({ hex, resolution: radius });
  };

  const updateJsonData = (center, resolution) => {
    const hex = latLngToCell(center[0], center[1], resolution);
    setGeoJsonData(
      featuresToGeoJson(convertHexesToGeoJson([hex], resolution)),
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
            <RadiusMap
              updateAreaSelected={(center, resolution) => {
                const hex = updateJsonData(center, resolution);
                setArea({ hex, resolution });
              }}
              setAddress={setAddress}
              center={center}
              defaultZoom={defaultZoom}
              setCenter={setCenter}
              geoJsonData={geoJsonData}
              radius={radius}
              setRadius={setRadius}
              setZoom={setZoom}
              width={'60vw'}
              height={'60vh'}
            />
            {address}
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
