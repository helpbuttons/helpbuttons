import { IoSearch } from "react-icons/io5";
import React, {useState} from "react";
import { useRef } from "store/Store";
import { GlobalState, store } from "pages";

///search button in explore and home
function HeaderSearch({filters, toggleShowFiltersForm}) {

  return (

         <div className="header-search__tool">

            <div className="header-search__form">

              <div className="header-search__column" onClick={(e) => {toggleShowFiltersForm(true)}}>
                <SearchText count={filters.count} where={filters.where}/>
                <SearchInfo helpButtonTypes={filters.helpButtonTypes} when={filters.when} what={filters.query}/>
                <div className="header-search__icon"><IoSearch/></div>
              </div>

            </div>

          </div>

  );
}

export { HeaderSearch };

function SearchText({count, where}) {
  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  
  const address = (where) => {
    if(where.address && where.radius)
    {
      return `· ${where.address} · ${where.radius}km`
    }
    if(selectedNetwork){
      return `in ${selectedNetwork.name}`
    }else{
      return ``
    }
  }

  return <div className="header-search__label">{count} helpbuttons found {address(where)}</div>
}

function SearchInfo({helpButtonTypes, when, what})
{
  const types = (helpButtonTypes) => {
    if (helpButtonTypes.length < 1)
    {
      return ''
    }
  
    return helpButtonTypes.toString();
  }
  const whenText = (when) => {
    if (when == 'any')
    {
      return '· Always'
    }
  
    return '';
  }
  const whatText = (what) => {
    if (what == '')
    {
      return ''
    }
  
    return what + " · ";
  }

  return <div className="header-search__info">{whatText(what)} {types(helpButtonTypes)} · {whenText(when)}</div>
}


