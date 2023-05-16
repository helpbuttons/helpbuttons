import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import t from 'i18n';
import { useToggle } from 'shared/custom.hooks';
import { BrowseType } from '../Map.consts';

export function BrowseTypeSelector({ setBrowseType }) {
  const [showMenu, toggleMenu] =
    useToggle(false);
  return (
    <>
      <Btn
        btnType={BtnType.splitIcon}
        caption={t('configure.chooseBrowseType')}
        contentAlignment={ContentAlignment.center}
        onClick={(e) => {e.preventDefault(); toggleMenu()}}
      />
      {showMenu && (
        <div>
          <Btn
            btnType={BtnType.splitIcon}
            caption={t('configure.browsePins')}
            contentAlignment={ContentAlignment.center}
            onClick={(e) => {
              e.preventDefault();
              setBrowseType(BrowseType.PINS);
            }}
          />
          <Btn
            btnType={BtnType.splitIcon}
            caption={t('configure.browseHoneyComb')}
            contentAlignment={ContentAlignment.center}
            onClick={(e) => {
              e.preventDefault();
              setBrowseType(BrowseType.HONEYCOMB);
            }}
          />
          <Btn
            btnType={BtnType.splitIcon}
            caption={t('configure.browseList')}
            contentAlignment={ContentAlignment.center}
            onClick={(e) => {
              e.preventDefault();
              setBrowseType(BrowseType.LIST);
            }}
          />
        </div>
      )}
    </>
  );
}
