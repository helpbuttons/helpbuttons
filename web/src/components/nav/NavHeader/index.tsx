///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfo with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import React from 'react';

import { HeaderSearch } from 'elements/HeaderSearch';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';

function NavHeader({ toggleShowFiltersForm, totalNetworkButtonsCount, hexagonClicked = false, isHome = false}) {
  const exploreMapState = useStore(
    store,
    (state: GlobalState) => state.explore.map,
    false
  );
  return (
    <>
      <div className="nav-header__container">
          <form className="nav-header__content">
            
            <div className="nav-header__content-message" onClick={toggleShowFiltersForm}>
              <HeaderSearch
                results={{count: !exploreMapState.initialized ? totalNetworkButtonsCount : exploreMapState.listButtons.length}}
                isHome={isHome}
                hexagonClicked={hexagonClicked}
              />
            </div>
          </form>
        
      </div>
    </>
  );
}

export default NavHeader;
