//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import React, { useState } from 'react';
import { IoClose, IoList, IoMap, IoMapOutline } from 'react-icons/io5';
import { IoChevronBackOutline } from 'react-icons/io5';
import ContentList from 'components/list/ContentList';
import { useButtonTypes } from 'shared/buttonTypes';
import t from 'i18n';
import {
  AdvancedFiltersSortDropDown,
} from 'components/search/AdvancedFilters';
import { GlobalState, store } from 'pages';
import { useStore } from 'store/Store';
import { UpdateFilters } from 'state/Explore';
import { useScrollHeightAndWidth } from 'elements/scroll';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import { ShowDesktopOnly, ShowMobileOnly } from 'elements/SizeOnly';
import { Dropdown } from 'elements/Dropdown/Dropdown';

function List({
  onLeftColumnToggle,
  buttons,
  showLeftColumn,
  showMap,
  toggleShowMap = (e) => {},
}) {
  const filters = useStore(
    store,
    (state: GlobalState) => state.explore.map.filters,
    false,
  );
  const showAdvancedFilters = useStore(
    store,
    (state: GlobalState) => state.explore.map.showAdvancedFilters,
    false
  );
  
  const showMapCaption = showMap
    ? 'explore.hideMap'
    : 'explore.showMap';

  const showMapIcon = showMap
  ? <IoClose/>
  : <IoMapOutline/>;

  const showListCaption = showLeftColumn
  ? 'explore.hideList'
  : 'explore.showList';

  const handleChangeShowMap = (event) => {
    toggleShowMap(event.target.value);
  };

  const updatesOrderByFilters = (value) => {
    const newFilters = { ...filters, orderBy: value };
    store.emit(new UpdateFilters(newFilters));
  };

  const updatesDisplayOptions = (value) => {
    console.log(value)
    if(value=="map")
    {
      console.log("pongo map" + event.target)
      toggleShowMap(true);
      onLeftColumnToggle(false);
    }
    if(value=="list")
    {
      console.log("pongo lista")
      toggleShowMap(false);
      onLeftColumnToggle(true);
    }
    if(value=="both")
    {
      toggleShowMap(true);
      onLeftColumnToggle(true);
    }
  };

  const handleChange = (event) => {
    onLeftColumnToggle(event.target.value);
  };

  const [buttonTypes, setButtonTypes] = useState([]);
  useButtonTypes(setButtonTypes);

  const {sliceSize, handleScrollHeight, handleScrollWidth} = useScrollHeightAndWidth(buttons.length)

  let dropdownMapOptions = [
    {
      value: "map",
      name: t(showMapCaption),
    },
    {
      value: "list",
      name: t(showListCaption),
    },
    {
      value: "both",
      name: t("explore.showBoth"),
    },
  ]

  return (
    <>
      {!showAdvancedFilters && (
        <>
          <div className={ 'list__container ' + (showMap ? '' : ' list__container--full-list')} onScroll={handleScrollHeight}>
            <div className={ 'list__order ' +  (showLeftColumn ? '' : ' list__order--hidden') + (showMap ? '' : ' list__order--full-screen')} >
              {showLeftColumn &&
                <AdvancedFiltersSortDropDown
                  className={'dropdown__dropdown-trigger--list'}
                  orderBy={filters.orderBy}
                  setOrderBy={(value) => updatesOrderByFilters(value)}
                  buttonTypes={buttonTypes}
                  selectedButtonTypes={filters.helpButtonTypes}
                />
              }
              <ShowDesktopOnly>
                <div onClick={handleChange} className={'drag-tab ' + (showLeftColumn ? '' : 'drag-tab--open') +  (showMap ? '' : 'drag-tab--hide')}>
                  <span className="drag-tab__line"></span>
                  <div className="drag-tab__icon">
                    {(!showLeftColumn) ? (
                      <Btn
                      btnType={BtnType.link}
                      iconLeft={IconType.svg}
                      iconLink={<IoList />}
                      contentAlignment={ContentAlignment.center}
                      caption={t(showListCaption)}
                        />
                    ) : (
                      <Btn
                      btnType={BtnType.link}
                      iconLeft={IconType.svg}
                      iconLink={<IoClose />}
                      contentAlignment={ContentAlignment.center}
                      caption={t(showListCaption)}
                      />
                    )}
                  </div>
                </div>
              </ShowDesktopOnly>
              <ShowMobileOnly>
                <div className={'list__show-map-button ' + (showLeftColumn ? '' : ' list__show-map-button--hideList')}>
                  <Dropdown
                      options={dropdownMapOptions}
                      className={'dropdown__dropdown-trigger--list'}
                      onChange={(value) => {updatesDisplayOptions(value)}}
                      // defaultSelected={orderBy}
                    />
                </div>
              </ShowMobileOnly>
            </div>
            <div
              className={
                'list__content ' +
                (showMap
                  ? 'list__content--row'
                  : 'list__content--full-screen')
              }
              onScroll={handleScrollWidth}
            >
              {buttonTypes?.length > 0 && (
                <ContentList
                  buttons={buttons.slice(0, sliceSize)}
                  buttonTypes={buttonTypes}
                  showMap={showMap}
                />
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default List;
