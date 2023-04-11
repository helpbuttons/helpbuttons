///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfo with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import React, {useState} from "react";
import Filters from "components/search/Filters";
import AdvancedFilters from "components/search/AdvancedFilters"; //just for mobile
import { Link } from 'elements/Link';
import { IoHomeOutline } from "react-icons/io5";
import { DropDownWhere } from "elements/Dropdown/DropDownWhere";
import t from "i18n";



function NavHeader({showSearch, updateFiltersType, handleSelectedPlace}) {

  // const [showSearch, setShowSearch] = useState(true);

  // const [showHideExtraFilters, setShowHideExtraFilters] = useState(true);

  const [showHideFiltersMobile, setShowHideFiltersMobile] = useState(false);

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

                <Link href="/HomeInfo" className="btn-circle">

                  <div className="btn-circle__content">

                    <div className="btn-circle__icon">

                      <IoHomeOutline />

                    </div>

                  </div>

                </Link>

                <div className="nav-header__content-message">

                  {showSearch &&
                    <DropDownWhere
                    onFocus={() => setShowHideFiltersMobile(true)} onBlur={() => setShowHideFiltersMobile(false)}
                    placeholder={t('homeinfo.searchlocation')}
                    handleSelectedPlace={handleSelectedPlace}
                  />

                  }

                </div>

            </form>

            <Filters updateFiltersType={updateFiltersType} />

            { showHideFiltersMobile ? <AdvancedFilters />  : null}


        </div>

    </>

  );

}

export default NavHeader;
