import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { useToggle } from 'shared/custom.hooks';
import { HbMapTiles } from '../Map.consts';
import t from 'i18n';
import Dropdown from 'elements/Dropdown/DropDown';

export function MapTileSelector({ tileType, setMapTile }) {
  const [showSelectTileType, setShowSelectTileType] =
    useToggle(false);

  const dropdownOptions = [
    {
      name: 'OSM',
      obj: HbMapTiles.OSM,
      onClick: () => {
        setMapTile(HbMapTiles.OSM);
        setShowSelectTileType(false);
      },
      selected: HbMapTiles.OSM == tileType
    },
    {
      name: 'Terrain',
      obj: HbMapTiles.TERRAIN,
      onClick: () => {
        setMapTile(HbMapTiles.TERRAIN);
        setShowSelectTileType(false);
      },
      selected: HbMapTiles.TERRAIN == tileType
    },
    {
      name: 'Toner',
      obj: HbMapTiles.TONER,
      onClick: () => {
        setMapTile(HbMapTiles.TONER);
        setShowSelectTileType(false);
      },
      selected: HbMapTiles.TONER == tileType
    },
    {
      name: 'Watercolor',
      obj: HbMapTiles.WATERCOLOR,
      onClick: () => {
        setMapTile(HbMapTiles.WATERCOLOR);
        setShowSelectTileType(false);
      },
      selected: HbMapTiles.WATERCOLOR == tileType
    },
  ];

  return (
    <div className="form__field">
      <Dropdown
        label="Select Map Type"
        listOption={dropdownOptions}
      />
    </div>
  );
}
