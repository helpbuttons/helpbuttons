import { HbMapUncontrolled } from '../';

import { MapTileSelector } from './MapTileSelector';
import { BrowseType } from '../Map.consts';
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


export function MapLocationKey({
  center,
  zoom,
  tileType,
  onBoundsChanged,
  handleMapClick,
  children
}) {
  return (
    <>
      <div className="picker__map">
        <HbMapUncontrolled
          onBoundsChanged={onBoundsChanged}
          mapCenter={center}
          mapZoom={zoom}
          width={'100%'}
          height={'18rem'}
          tileType={tileType}
          handleMapClick={handleMapClick}
        >
          {children}
        </HbMapUncontrolled>
      </div>
    </>
  );
}
