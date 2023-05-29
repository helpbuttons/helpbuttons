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



function NavHeader({showSearch, updateFiltersType, handleSelectedPlace}) {

  const [showFiltersBar, setshowFiltersBar] = useState(true);

  const [showFilters, setShowFilters] = useState(false);

  // const [showHideExtraFilters, setShowHideExtraFilters] = useState(true);

  // const [showHideFilters, setShowHideFilters] = useState(true);
  //
  // const [showHideInfoOverlay, setShowHideInfoOverlay] = useState(true);
  //
  // const [showSearch, setShowSearch] = useState(true);
  //
  // const [name, setName] = useState(true);
  //
  // const [tag, setTag] = useState(true);
  //
  // const [search, setSearch] = useState(true);
  //
  // const [results, setResults] = useState(true);

  // const handleChange = event => {
  //     
  //     props.onchange(event.target.value);
  // }
  // const updateFiltersType = (type, value) => {
  //   console.log(`changed ${type} to ${value}`)
  // }

  return(

    <>

        <div className={'nav-header__container' + (showSearch ? '' : 'nav-header--hide')}>

            <form className="nav-header__content">

                <div className="nav-header__content-message">

                <HeaderSearch setShowFilters={setShowFilters} showFilters={showFilters}/>

                </div>

            </form>

            { showFiltersBar ? <Filters updateFiltersType={updateFiltersType} /> : null }         
            { showFilters ? <AdvancedFilters setShowFilters={setShowFilters} showFilters={showFilters}/>  : null}


        </div>

    </>

  );

}

export default NavHeader;
