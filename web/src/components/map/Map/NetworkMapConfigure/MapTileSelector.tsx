import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { useToggle } from 'shared/custom.hooks';
import { HbMapTiles } from '../Map.consts';
import t from 'i18n';
import { Dropdown } from 'elements/Dropdown/Dropdown';

export function MapTileSelector({ tileType, setMapTile }) {

  const dropdownOptions = [
    {
      name: 'OSM',
      value: HbMapTiles.OSM,
    },
    {
      name: 'Terrain',
      value: HbMapTiles.TERRAIN,
    },
    {
      name: 'Toner',
      value: HbMapTiles.TONER,    },
    {
      name: 'Watercolor',
      value: HbMapTiles.WATERCOLOR,
    },
  ];

  return (
    <div className="form__field">
      <Dropdown
        label="Select Map Type"
        options={dropdownOptions}
        onChange={(value) => {setMapTile(value)}}
        defaultSelected={tileType}
      />
    </div>
  );
}
