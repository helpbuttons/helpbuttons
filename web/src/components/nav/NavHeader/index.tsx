///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfo with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import React from 'react';

import { HeaderSearch } from 'elements/HeaderSearch';
import router from 'next/router';

function NavHeader({ toggleShowFiltersForm, filters, isHome = false}) {
  const onSearchBarClick = (e) => {
    e.preventDefault()
    if (isHome)
    {
      // router.push(`/Explore#`)
      // TODO: when loading the filters, the bounds are not loaded corretly.. 
      router.push(`/Explore#?showFilters=true`)
    }
  }
  return (
    <>
      <div className="nav-header__container">
          <form className="nav-header__content">
            
            <div className="nav-header__content-message" onClick={onSearchBarClick}>
              <HeaderSearch
                filters={filters}
                toggleShowFiltersForm={toggleShowFiltersForm}
              />
            </div>
          </form>
        
      </div>
    </>
  );
}

export default NavHeader;
