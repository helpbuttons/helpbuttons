import { IoClose, IoSearch } from 'react-icons/io5';
import React, { useEffect, useRef, useState } from 'react';
import { useGlobalStore, useStore } from 'state';
import { GlobalState, store } from 'state';
import { LoadabledComponent } from 'components/loading';
import t from 'i18n';
import { useButtonTypes } from 'shared/buttonTypes';
import { customFieldsFiltersText } from 'components/button/ButtonType/CustomFields/AdvancedFiltersCustomFields';
import { defaultFilters, isFiltering } from 'components/search/AdvancedFilters/filters.type';
import { ExploreMapState, ResetFilters, ToggleAdvancedFilters } from 'state/Explore';
import { readableDistance } from 'shared/sys.helper';
import { Network } from 'shared/entities/network.entity';

export function HeaderSearch({ toggleAdvancedFilters, exploreMapState, selectedNetwork}: {toggleAdvancedFilters: any, exploreMapState: ExploreMapState, selectedNetwork: any}) {
  const [buttonCount, setButtonCount] = useState(selectedNetwork.buttonCount)
  const pageName = useGlobalStore((state: GlobalState) => state.homeInfo.pageName)

  useEffect(() => {
    if(pageName == 'Explore' && exploreMapState.listButtons)
    {
      setButtonCount(() => exploreMapState.listButtons.length)
    }else {
      setButtonCount(() => selectedNetwork.buttonCount)
      
    }
  }, [exploreMapState.listButtons, selectedNetwork.buttonCount])

  const clearButton = useRef(null);
  const filtered = isFiltering()
  return (
    <div
      className={
        filtered
          ? 'header-search__tool--filtered'
          : 'header-search__tool'
      }
    >
      <div
        className="header-search__form"
        onClick={(e) => {
          if (clearButton.current?.contains(e.target)) {
            store.emit(new ResetFilters());
            store.emit(new ToggleAdvancedFilters(false));
          } else {
            toggleAdvancedFilters();
          }
        }}
      >
        <div className="header-search__column">
          <SearchText
            count={buttonCount}
            where={exploreMapState.filters.where}
            filtering={filtered}
          />
          <SearchInfo
            query={exploreMapState.filters.query}
            tags={exploreMapState.filters.tags}
            filters={exploreMapState.filters}
          />
          <div className="header-search__icons">
            {!filtered && (
              <div className="header-search__icon">
                <IoSearch />
              </div>
            )}
            {filtered && (
              <div
                ref={clearButton}
                className="header-search__icon--close"
              >
                <IoClose />
              </div>
            )}
          </div>
        </div>
        {/* </LoadabledComponent> */}
      </div>
    </div>
  );
}

function SearchText({ count, where, filtering = false }) {
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
    if (hexagonClicked) {
      return t('buttonFilters.selectedArea');
    } else if (where.address && where.radius) {
      return `${t('common.in')} ${where.address} · ${readableDistance(
        where.radius,
      )}`;
    } else if (filtering) {
      return `${t('buttonFilters.filteredSearch')}`;
    } else if (selectedNetwork?.buttonCount != count) {
      return `${t('buttonFilters.focusedArea')}`;
    } else if (selectedNetwork) {
      return `${t('common.in')} ${selectedNetwork.name}`;
    } else {
      return ``;
    }
  };

  const countString = count > 999 ? '> 1000 ' : count;
  return (
    <div className="header-search__label">
      {t('buttonFilters.searchBarTop', [address(where), countString])}
    </div>
  );
}

function SearchInfo({ filters, query, tags }) {
  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
    false,
  );

  if (!selectedNetwork) return <></>;

  return (
    <div className="header-search__info">
      <AdvancedFiltersQueryString
        query={query}
        selectedButtonTypes={filters.helpButtonTypes}
        tags={tags}
        filters={filters}
        currency={selectedNetwork.currency}
      />
    </div>
  );
}

export function AdvancedFiltersQueryString(
  { query,
    selectedButtonTypes,
    tags,
    filters,
    currency }
) {
  const buttonTypes = useButtonTypes();
  const whatText = (what) => {
    if (what == '') {
      return '';
    }
    return what + ' · ';
  };
  const whichTags = (tags) => {
    return (tags ? ' · ' : '') + tags.join(' · ');
  };

  const [filterTypesCaption, setFilterTypesCaption] = useState(
    t('buttonFilters.allButtonTypes'),
  );

  useEffect(() => {
    if (buttonTypes) {


      const buttonTypesCaptions = buttonTypes
        .filter((buttonType) => {
          return selectedButtonTypes.find((type) => {
            return type == buttonType.name;
          });
        })
        .map((buttonType) => {
          return buttonType.caption;
        });
      setFilterTypesCaption(() => buttonTypesCaptions.join(', '));

      if (selectedButtonTypes.length < 1) {
        setFilterTypesCaption(() =>
          t('buttonFilters.allButtonTypes'),
        );
      }

    }
  }, [buttonTypes, selectedButtonTypes]);
  return (
    <>
      {whatText(query)} {filterTypesCaption}
      {whichTags(tags)} {customFieldsFiltersText(filters, currency)}
    </>
  );
}
