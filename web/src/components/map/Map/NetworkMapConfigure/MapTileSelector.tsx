import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { useToggle } from 'shared/custom.hooks';
import { HbMapTiles } from '../Map.consts';
import t from 'i18n';
import Dropdown from 'elements/Dropdown/DropDown';



export function MapTileSelector({ setMapTile }) {

  const [showSelectTileType, setShowSelectTileType] =
    useToggle(false);

  
const dropdownOptions = [
  {
    name: 'OSM',
    obj: HbMapTiles.OSM,
    onClick: () => {
      setMapTile(HbMapTiles.OSM);
      setShowSelectTileType();
    },
  },
  {
    name: 'Terrain',
    obj: HbMapTiles.TERRAIN,
    onClick: () => {
      setMapTile(HbMapTiles.TERRAIN);
      setShowSelectTileType();
    },
  },
  {
    name: 'Toner',
    obj: HbMapTiles.TONER,
    onClick: () => {
      setMapTile(HbMapTiles.TONER);
      setShowSelectTileType();
    },
  },
  {
    name: 'Watercolor',
    obj: HbMapTiles.WATERCOLOR,
    onClick: () => {
      setMapTile(HbMapTiles.WATERCOLOR);
      setShowSelectTileType();
    },
  },
];

  return (

      <div className='form__field'>


        <Dropdown label="Select Map Type"  listOption={dropdownOptions} />
        

      </div>
  );
}
