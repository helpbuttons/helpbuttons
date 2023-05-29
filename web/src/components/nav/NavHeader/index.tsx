///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfo with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import React, {useState} from "react";

import Filters from "components/search/Filters";
import AdvancedFilters from "components/search/AdvancedFilters"; //just for mobile
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn';
import { HeaderSearch } from 'elements/HeaderSearch'; 
import { Link } from 'elements/Link';
import { IoHomeOutline } from "react-icons/io5";
import t from "i18n";
import DropDownSearchLocation from "elements/DropDownSearchLocation";
import { useToggle } from "shared/custom.hooks";



function NavHeader({showSearch, showFiltersForm, toggleShowFiltersForm}) {

  const filters = {
    query: 'xxx',
    helpButtonTypes: [], // 
    where: {address: 'Albacete', center: [100,100], radius: '25'},
    when: 'any',
    results: {
      count: 48,
    }
  }
  

  return(

    <>

        <div className={'nav-header__container' + (showSearch ? '' : 'nav-header--hide')}>

            <form className="nav-header__content">

                <div className="nav-header__content-message">

                <HeaderSearch filters={filters} toggleShowFiltersForm={toggleShowFiltersForm}/>

                </div>

            </form>

            { showFiltersForm &&
             <AdvancedFilters toggleShowFiltersForm={toggleShowFiltersForm} />
             }


        </div>

    </>

  );

}

export default NavHeader;
