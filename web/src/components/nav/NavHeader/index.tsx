///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfo with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import React from 'react';

import { HeaderSearch } from 'elements/HeaderSearch';
import { useGlobalStore } from 'state';
import { GlobalState, store } from 'state';
import NavBottom from '../NavBottom';
import BrandCard from 'components/map/Map/BrandCard';
import { ShowDesktopOnly } from 'elements/SizeOnly';
import router from 'next/router';
import { ListButtonTypes } from '../ButtonTypes';
import { ExploreMapState, ToggleAdvancedFilters } from 'state/Explore';

function NavHeader({ selectedNetwork }){
  const exploreMapState : ExploreMapState = useGlobalStore((state: GlobalState) => state.explore.map);
  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser);
  const pageName = useGlobalStore((state: GlobalState) => state.homeInfo.pageName)

  const toggleAdvancedFilters = () => {
    store.emit(new ToggleAdvancedFilters())
    if(['Explore'].indexOf(pageName) < 0){
      router.push('/Explore')
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
              toggleAdvancedFilters={toggleAdvancedFilters}
              selectedNetwork={selectedNetwork}
              exploreMapState={exploreMapState}
            />
          </div>
        </form>
        <ShowDesktopOnly>
          <NavBottom sessionUser={sessionUser} />
        </ShowDesktopOnly>
      </div>
      <ShowDesktopOnly>
        <div className="nav-header__filters">
          <ListButtonTypes/>
        </div>
      </ShowDesktopOnly>
    </div>
  );
}

export default NavHeader;
