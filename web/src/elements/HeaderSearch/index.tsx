import { IoSearch } from 'react-icons/io5';
import React, { useState } from 'react';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { LoadabledComponent } from 'components/loading';
import t from 'i18n';
import { useButtonTypes } from 'shared/buttonTypes';

///search button in explore and home
export function HeaderSearch({ results, isHome }) {
  const exploreMapState = useStore(
    store,
    (state: GlobalState) => state.explore.map,
    false,
  );
  const [buttonTypes, setButtonTypes] = useState(null);
  useButtonTypes(setButtonTypes);
  return (
    <div className="header-search__tool">
      <div className="header-search__form">
        <LoadabledComponent
          loading={exploreMapState.loading && !isHome && buttonTypes}
        >
          <div className="header-search__column">
            <SearchText
              count={results.count}
              where={exploreMapState.filters.where}
            />
            {buttonTypes && (
              <SearchInfo
                helpButtonTypes={
                  exploreMapState.filters.helpButtonTypes
                }
                when={exploreMapState.filters.when}
                what={exploreMapState.filters.query}
                buttonTypes={buttonTypes}
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

function SearchText({ count, where }) {
  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
    false,
  );

  const address = (where) => {
    if (where.address && where.radius) {
      return `in ${where.address} · ${where.radius}km`;
    }
    if (selectedNetwork) {
      return `in ${selectedNetwork.name}`;
    } else {
      return ``;
    }
  };

  return (
    <div className="header-search__label">
      {count} helpbuttons found {address(where)}
    </div>
  );
}

function SearchInfo({ helpButtonTypes, when, what, buttonTypes }) {
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
  const whenText = (when) => {
    if (when == 'any') {
      return '· Always';
    }

    return '';
  };
  const whatText = (what) => {
    if (what == '') {
      return '';
    }

    return what + ' · ';
  };

  return (
    <div className="header-search__info">
      {whatText(what)} {types(helpButtonTypes)} {whenText(when)}
    </div>
  );
}
