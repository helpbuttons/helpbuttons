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
import { defaultFilters } from 'components/search/AdvancedFilters/filters.type';

function NavHeader({ selectedNetwork, pageName = 'Explore' }) {

  const exploreMapState = useStore(
    store,
    (state: GlobalState) => state.explore.map,
    false,
  );
  const filtering = JSON.stringify(defaultFilters) != JSON.stringify(exploreMapState.filters);

  return (
    <div className="nav-header">
      <div className="nav-header__container">
        <ShowDesktopOnly>
          <BrandCard />
        </ShowDesktopOnly>
        <form className="nav-header__content">
          <div
            className="nav-header__content-message"
            onClick={() => {
              if(pageName == 'Explore')
              {
                store.emit(new ToggleAdvancedFilters())
              }else{
                router.push('/Explore?showFilters=true')
              }
            }}
          >
            <HeaderSearch
              results={{
                count: !filtering
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
