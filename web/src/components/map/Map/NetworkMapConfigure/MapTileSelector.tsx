import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { useToggle } from 'shared/custom.hooks';
import { HbMapTiles } from '../Map.consts';

export function MapTileSelector({ setMapTile }) {
  const [showSelectTileType, setShowSelectTileType] =
    useToggle(false);
  return (
    <>
      <Btn
        btnType={BtnType.splitIcon}
        caption={'change tiles type'}
        contentAlignment={ContentAlignment.center}
        onClick={(e) => {e.preventDefault(); setShowSelectTileType()}}
      />
      {showSelectTileType && (
        <div>
          <Btn
            btnType={BtnType.splitIcon}
            caption={'osm'}
            contentAlignment={ContentAlignment.center}
            onClick={(e) => {
              e.preventDefault();
              setMapTile(HbMapTiles.OSM);
            }}
          />
          <Btn
            btnType={BtnType.splitIcon}
            caption={'terrain'}
            contentAlignment={ContentAlignment.center}
            onClick={(e) => {
              e.preventDefault();
              setMapTile(HbMapTiles.TERRAIN);
            }}
          />
          <Btn
            btnType={BtnType.splitIcon}
            caption={'toner'}
            contentAlignment={ContentAlignment.center}
            onClick={(e) => {
              e.preventDefault();
              setMapTile(HbMapTiles.TONER);
            }}
          />
          <Btn
            btnType={BtnType.splitIcon}
            caption={'watercolor'}
            contentAlignment={ContentAlignment.center}
            onClick={(e) => {
              e.preventDefault();
              setMapTile(HbMapTiles.WATERCOLOR);
            }}
          />
        </div>
      )}
    </>
  );
}
