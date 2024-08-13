//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useEffect, useState } from 'react';
import { getDistance } from 'geolib';

import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import t from 'i18n';

import { NetworkMapConfigure } from 'components/map/Map/NetworkMapConfigure';
import { BrowseType, HbMapTiles } from 'components/map/Map/Map.consts';
import circleToPolygon from 'circle-to-polygon';
import { getBoundsHexFeatures, roundCoords } from 'shared/honeycomb.utils';
import PickerField from 'components/picker/PickerField';
import { MapTileSelector } from 'components/map/Map/NetworkMapConfigure/MapTileSelector';

export default function FieldAreaMap({
  validationError,
  onChange,
  marker,
  label,
  explain,
  markerColor = 'pink',
  value
}) {
  const [showPopup, setShowPopup] =  useState(true)

  const closePopup = () => setShowPopup(() => false)
  const openPopup = () => setShowPopup(() => true)
  return (
    <PickerField showPopup={showPopup} validationError={validationError} label={label} btnLabel={label} explain={explain} headerText={t('picker.headerText')} openPopup={openPopup} closePopup={closePopup}>
       <FieldSelectedHexesMapSettings
          defaultExploreSettings={value}
          onChange={onChange}
          closePopup={closePopup}
        />
    </PickerField>
  )
}

export function FieldSelectedHexesMapSettings({
  defaultExploreSettings,
  onChange,
  closePopup = () => {console.log('defailtt yyy')}
}) {

  const [mapSettings, setMapSettings] = useState(() => {
    return {...{
      center: [0,0],
      zoom: 4,
      tileType: HbMapTiles.OSM,
      browseType: BrowseType.HONEYCOMB,
      networkArea: [],
    }, ...defaultExploreSettings}
  })

  const setMapTile = (mapTile) => {
    setMapSettings((prevSettings) => {return {...prevSettings, tileType: mapTile}})
  }

  useEffect(() => {
    onChange({zoom: mapSettings.zoom, center: mapSettings.center, tileType: mapSettings.tileType, browseType: mapSettings.browseType})
  }, [mapSettings])

return (
  <>
              <NetworkMapConfigure
                mapSettings={mapSettings}
              />
              {/* <DropDownSearchLocation
                placeholder={t('homeinfo.searchlocation')}
                handleSelectedPlace={handleSelectedPlace}
              /> */}
              <MapTileSelector
                setMapTile={setMapTile}
                tileType={mapSettings.tileType}
                />
              <Btn
                btnType={BtnType.submit}
                caption={t('common.save')}
                contentAlignment={ContentAlignment.center}
                onClick={() => closePopup()}
              />
              </>
)
}
