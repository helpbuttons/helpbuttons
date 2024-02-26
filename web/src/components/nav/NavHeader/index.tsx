///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfo with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import React from 'react';

import { HeaderSearch } from 'elements/HeaderSearch';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import { IoFilter, IoTrashBinOutline } from 'react-icons/io5';
import NavBottom from '../NavBottom';
import BrandCard from 'components/map/Map/BrandCard';
import { ShowDesktopOnly } from 'elements/SizeOnly';
import t from 'i18n';

function NavHeader({ toggleShowFiltersForm, totalNetworkButtonsCount, hexagonClicked = false, isHome = false}) {
  const exploreMapState = useStore(
    store,
    (state: GlobalState) => state.explore.map,
    false
  );
  return (
      <div className="nav-header">
        <div className="nav-header__container">

          <ShowDesktopOnly>
            <BrandCard/>
          </ShowDesktopOnly>
          <form className="nav-header__content">
            <div className="nav-header__content-message" onClick={toggleShowFiltersForm}>
              <HeaderSearch
                results={{count: !exploreMapState.initialized ? totalNetworkButtonsCount : exploreMapState.listButtons.length}}
                isHome={isHome}
                hexagonClicked={hexagonClicked}
              />
            </div>
          </form>
          <ShowDesktopOnly>
            <NavBottom loggedInUser={undefined}/>
          </ShowDesktopOnly>
      </div>
      <ShowDesktopOnly>
            <div className='nav-header__filters'>
              <Btn
                btnType={BtnType.filter}
                iconLeft={IconType.circle}
                contentAlignment={ContentAlignment.left}
                caption={t('common.publish')}
                submit={true}
              />
              <Btn
                btnType={BtnType.filter}
                iconLeft={IconType.circle}
                contentAlignment={ContentAlignment.left}
                caption={t('common.publish')}
                submit={true}
              />
            </div>
      </ShowDesktopOnly>
      </div>
  );
}

export default NavHeader;
