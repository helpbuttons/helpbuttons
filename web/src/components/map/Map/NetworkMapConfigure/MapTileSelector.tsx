import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { useToggle } from 'shared/custom.hooks';
import { HbMapTiles } from '../Map.consts';
import t from 'i18n';

export function MapTileSelector({ setMapTile }) {
  const [showSelectTileType, setShowSelectTileType] =
    useToggle(false);
  return (

      <div className='form__field'>

        <Btn
          btnType={BtnType.splitIcon}
          caption={t('configuration.selectMapStyle')}
          contentAlignment={ContentAlignment.center}
          onClick={(e) => {e.preventDefault(); setShowSelectTileType()}}
        />

        {showSelectTileType && (
          <div >
            <Btn
              btnType={BtnType.splitIcon}
              caption={'osm'}
              contentAlignment={ContentAlignment.center}
              onClick={(e) => {
                e.preventDefault();
                setMapTile(HbMapTiles.OSM);
                setShowSelectTileType();
              }}
            />
            <Btn
              btnType={BtnType.splitIcon}
              caption={'terrain'}
              contentAlignment={ContentAlignment.center}
              onClick={(e) => {
                e.preventDefault();
                setMapTile(HbMapTiles.TERRAIN);
                setShowSelectTileType();
              }}
            />
            <Btn
              btnType={BtnType.splitIcon}
              caption={'toner'}
              contentAlignment={ContentAlignment.center}
              onClick={(e) => {
                e.preventDefault();
                setMapTile(HbMapTiles.TONER);
                setShowSelectTileType();
              }}
            />
            <Btn
              btnType={BtnType.splitIcon}
              caption={'watercolor'}
              contentAlignment={ContentAlignment.center}
              onClick={(e) => {
                e.preventDefault();
                setMapTile(HbMapTiles.WATERCOLOR);
                setShowSelectTileType();
              }}
            />
          </div>
        )}

      </div>
  );
}
