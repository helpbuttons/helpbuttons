import { IoSearch } from "react-icons/io5";
import React, {useState} from "react";

///search button in explore and home
function HeaderSearch({filters, toggleShowFiltersForm}) {

  return (

         <div className="header-search__tool">

            <div className="header-search__form">

              <div className="header-search__column" onClick={(e) => {toggleShowFiltersForm()}}>
                <div className="header-search__label">{filters.results.count} helpbuttons · {filters.where.address} · {filters.where.radius}km</div>
                <div className="header-search__info">{ButtonTypesText(filters.helpButtonTypes)} · {WhenText(filters.when)}</div>
                <div className="header-search__icon"><IoSearch/></div>
              </div>

            </div>

          </div>

  );
}

export { HeaderSearch };


function ButtonTypesText(filteredTypes) {
  if (filteredTypes.length < 1)
  {
    return 'Any helpbutton type'
  }

  return filteredTypes.toString();
}

function WhenText(when) {
  if (when == 'any')
  {
    return 'Any time'
  }

  return '...';
}