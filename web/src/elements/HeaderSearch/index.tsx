import { IoSearch } from "react-icons/io5";
import React, {useState} from "react";
import { useStore } from "store/Store";
import { GlobalState, store } from "pages";
import { buttonTypes } from "shared/buttonTypes";
import { LoadabledComponent } from "components/loading";

///search button in explore and home
export function HeaderSearch({results}) {
  const filters = useStore(
    store,
    (state: GlobalState) => state.explore.map.filters,
    false
  );
  
  const loaded = useStore(
    store,
    (state: GlobalState) => state.explore.map.loaded,
    false
  );

  return (

         <div className="header-search__tool">
            <div className="header-search__form">

              <div className="header-search__column">
                
                <LoadabledComponent loading={!loaded}>
                <SearchText count={results.count} where={filters.where}/>
                <SearchInfo helpButtonTypes={filters.helpButtonTypes} when={filters.when} what={filters.query}/>
                <div className="header-search__icon"><IoSearch/></div>
                </LoadabledComponent>
              </div>

            </div>

          </div>

  );
}

function SearchText({count, where}) {
  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  
  const address = (where) => {
    if(where.address && where.radius)
    {
      return `in ${where.address} · ${where.radius}km`
    }
    if(selectedNetwork){
      return `in ${selectedNetwork.name}`
    }else{
      return ``
    }
  }

  return <div className="header-search__label">{count} found {address(where)}</div>
}

function SearchInfo({helpButtonTypes, when, what})
{
  const types = (helpButtonTypes) => {
    if (helpButtonTypes.length < 1)
    {
      return ''
    }
    const buttonTypesCaptions = helpButtonTypes.map((type) => (buttonTypes.find((buttonType) => type == buttonType.name)).caption)
    return buttonTypesCaptions.toString();
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

  return <div className="header-search__info">{whatText(what)} {types(helpButtonTypes)} {whenText(when)}</div>
}


