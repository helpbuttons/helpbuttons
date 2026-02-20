///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfo with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import React from 'react';

import { HeaderSearch } from 'elements/HeaderSearch';
import { useGlobalStore } from 'state';
import { GlobalState, store } from 'state';
import NavBottom from '../NavBottom';
import BrandCard from 'components/map/Map/BrandCard';
import { ShowDesktopOnly, ShowMobileOnly } from 'elements/SizeOnly';
import router from 'next/router';
import { ListButtonTypes } from '../ButtonTypes';
import { ExploreMapState, ToggleAdvancedFilters } from 'state/Explore';

function NavHeader({ selectedNetwork , isScrollingUp}){
  const exploreMapState : ExploreMapState = useGlobalStore((state: GlobalState) => state.explore.map);
  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser);
  const pageName = useGlobalStore((state: GlobalState) => state.homeInfo.pageName)

  const toggleAdvancedFilters = () => {
    store.emit(new ToggleAdvancedFilters())
    if(['Explore'].indexOf(pageName) < 0){
      router.push('/Explore')
    }
  }

    const IsHomeInfo = pageName == 'HomeInfo';
    const IsExplorePage = pageName == 'Explore';

  return (
    <div className={(IsHomeInfo ? "nav-header--homeinfo " : "" ) + " nav-header "}>
      <div  className={(IsHomeInfo ? "nav-header__container--homeinfo " : "" )+ " nav-header__container"} >
        <ShowDesktopOnly>
          <BrandCard />
        </ShowDesktopOnly>
        <>
        {((IsExplorePage || IsHomeInfo )  &&    
            <form  className={(IsHomeInfo ? "nav-header__content--homeinfo " : "" )+ " nav-header__content"} >
            <div className="nav-header__content-message">
              <HeaderSearch
                toggleAdvancedFilters={toggleAdvancedFilters}
                selectedNetwork={selectedNetwork}
                exploreMapState={exploreMapState}
              />
            </div>
          </form>
          )}  
       </> 
        
        <ShowDesktopOnly>
          <NavBottom sessionUser={sessionUser} isScrollingUp={false} />
        </ShowDesktopOnly>
      </div>
      <div className="nav-header__filters">
        {(IsExplorePage && <ListButtonTypes/>)}
      </div>
    </div>
  );
}

export default NavHeader;
