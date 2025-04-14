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
