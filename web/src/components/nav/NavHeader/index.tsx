///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfo with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import React from 'react';

import { HeaderSearch } from 'elements/HeaderSearch';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import NavBottom from '../NavBottom';
import BrandCard from 'components/map/Map/BrandCard';
import { ShowDesktopOnly } from 'elements/SizeOnly';
import router from 'next/router';
import { ListButtonTypes } from '../ButtonTypes';
import { ToggleAdvancedFilters } from 'state/Explore';

function NavHeader({ selectedNetwork, pageName = 'Explore' }) {

  const exploreMapState = useStore(
    store,
    (state: GlobalState) => state.explore.map,
    false,
  );
  const loggedInUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  const toggleAdvancedFilters = () => {
    if(pageName == 'Explore')
    {
      store.emit(new ToggleAdvancedFilters())
    }else{
      router.push('/Explore?showFilters=true')
    }
  }

  return (
    <div className="nav-header">
      <div className="nav-header__container">
        <ShowDesktopOnly>
          <BrandCard />
        </ShowDesktopOnly>
        <form className="nav-header__content">
          <div className="nav-header__content-message">
            <HeaderSearch
              results={{
                count: (pageName != 'Explore' || !exploreMapState.listButtons)
                  ? selectedNetwork?.buttonCount
                  : exploreMapState.listButtons.length,
              }}
              toggleAdvancedFilters={toggleAdvancedFilters}
            />
          </div>
        </form>
        <ShowDesktopOnly>
          <NavBottom pageName={pageName} loggedInUser={loggedInUser} />
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
