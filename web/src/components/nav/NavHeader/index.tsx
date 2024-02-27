///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfo with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import React, { useEffect } from 'react';

import { HeaderSearch } from 'elements/HeaderSearch';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import NavBottom from '../NavBottom';
import BrandCard from 'components/map/Map/BrandCard';
import { ShowDesktopOnly } from 'elements/SizeOnly';
import t from 'i18n';
import router from 'next/router';
import { ToggleAdvancedFilters } from 'state/Explore';
import { ListButtonTypes } from '../ButtonTypes';

function NavHeader({ selectedNetwork, pageName = 'Explore' }) {
  const showAdvancedFilters = useStore(
    store,
    (state: GlobalState) => state.explore.map.showAdvancedFilters,
    false,
  );

  const toggleShowAdvancedFilters = () => {
    store.emit(new ToggleAdvancedFilters());
  };

  const exploreMapState = useStore(
    store,
    (state: GlobalState) => state.explore.map,
    false,
  );

  useEffect(() => {
    if(showAdvancedFilters && pageName != 'Explore')
    {
      router.push('/Explore')
    }
  }, [showAdvancedFilters])
  return (
    <div className="nav-header">
      <div className="nav-header__container">
        <ShowDesktopOnly>
          <BrandCard />
        </ShowDesktopOnly>
        <form className="nav-header__content">
          <div
            className="nav-header__content-message"
            onClick={toggleShowAdvancedFilters}
          >
            <HeaderSearch
              results={{
                count: !exploreMapState.initialized
                  ? selectedNetwork?.buttonCount
                  : exploreMapState.listButtons.length,
              }}
              isHome={pageName == 'HomeInfo'}
            />
          </div>
        </form>
        <ShowDesktopOnly>
          <NavBottom loggedInUser={undefined} />
        </ShowDesktopOnly>
      </div>
      <ShowDesktopOnly>
        <div className="nav-header__filters">
          <ListButtonTypes selectedNetwork={selectedNetwork}/>
        </div>
      </ShowDesktopOnly>
    </div>
  );
}

export default NavHeader;
