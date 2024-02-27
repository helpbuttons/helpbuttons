import { IoSearch } from 'react-icons/io5';
import React, { useState } from 'react';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { LoadabledComponent } from 'components/loading';
import t from 'i18n';
import { useButtonTypes } from 'shared/buttonTypes';
import { customFieldsFiltersText } from 'components/button/ButtonType/CustomFields/AdvancedFiltersCustomFields';
import { defaultFilters } from 'components/search/AdvancedFilters/filters.type';

///search button in explore and home
export function HeaderSearch({ results }) {
  const exploreMapState = useStore(
    store,
    (state: GlobalState) => state.explore.map,
    false,
  );
  const [buttonTypes, setButtonTypes] = useState(null);
  useButtonTypes(setButtonTypes);
  const filtering= JSON.stringify(defaultFilters) != JSON.stringify(exploreMapState.filters);
  return (
    <div className={filtering ?"header-search__tool--filtered" :"header-search__tool"} >
      <div className="header-search__form">
        <LoadabledComponent
          loading={exploreMapState.loading && buttonTypes}
        >
          <div className="header-search__column">
            <SearchText
              count={results.count}
              where={exploreMapState.filters.where}
              filtering={filtering}
            />
            
            {buttonTypes && (
              <SearchInfo
                helpButtonTypes={
                  exploreMapState.filters.helpButtonTypes
                }
                what={exploreMapState.filters.query}
                buttonTypes={buttonTypes}
                filters={exploreMapState.filters}
              />
            )}
            <div className="header-search__icon">
              <IoSearch />
            </div>
          </div>
        </LoadabledComponent>
      </div>
    </div>
  );
}

function SearchText({ count, where , filtering=false}) {
  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
    false,
  );

  const hexagonClicked = useStore(
    store,
    (state: GlobalState) => state.explore.settings.hexagonClicked,
    false,
  );

  const address = (where) => {


    if(hexagonClicked)
    {
      return t('buttonFilters.selectedArea');
    }else if (where.address && where.radius) {
      return `${t('common.in')} ${where.address} · ${where.radius}km`;
    }else if (filtering) {
      return `${t('buttonFilters.filteredSearch')}`;
    // }else if(selectedNetwork.buttonCount != count){
    //   return `${t('buttonFilters.focusedArea')}`;
    }else if (selectedNetwork) {
      return `${t('common.in')} ${selectedNetwork.name}`;
    } else {
      return ``;
    }
  };

  const countString = count > 999 ? '> 1000 ': count 
  return (
    <div className="header-search__label">
      {t('buttonFilters.searchBarTop', [address(where),countString])}
    </div>
  );
}

function SearchInfo({ helpButtonTypes, filters, what, buttonTypes }) {
  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
    false,
  );

  const types = (helpButtonTypes) => {
    if (helpButtonTypes.length < 1) {
      return t('buttonFilters.allButtonTypes');
    }
    const buttonTypesCaptions = helpButtonTypes.map(
      (type) =>
        buttonTypes.find((buttonType) => type == buttonType.name)
          .caption,
    );
    return buttonTypesCaptions.toString();
  };
  
  const whatText = (what) => {
    if (what == '') {
      return '';
    }

    return what + ' · ';
  };
  
  return (
    <div className="header-search__info">
      {whatText(what)} {types(helpButtonTypes)} {customFieldsFiltersText(filters, selectedNetwork.currency)}
    </div>
  );
}
