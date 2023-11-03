//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import React, { useState } from 'react';
import { IoChevronForwardOutline, IoMapOutline } from 'react-icons/io5';
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
import { ShowMobileOnly } from 'elements/SizeOnly';

function List({
  onLeftColumnToggle,
  buttons,
  showLeftColumn,
  showFiltersForm,
  showMap,
  toggleShowMap,
}) {
  const filters = useStore(
    store,
    (state: GlobalState) => state.explore.map.filters,
    false,
  );

  
  const showMapCaption = showMap
    ? 'explore.hideMap'
    : 'explore.showMap';

  const handleChangeShowMap = (event) => {
    toggleShowMap(event.target.value);
  };

  const updatesOrderByFilters = (value) => {
    const newFilters = { ...filters, orderBy: value };
    store.emit(new UpdateFilters(newFilters));
  };

  const handleChange = (event) => {
    onLeftColumnToggle(event.target.value);
  };

  const [buttonTypes, setButtonTypes] = useState([]);
  useButtonTypes(setButtonTypes);

  const {sliceSize, handleScrollHeight, handleScrollWidth} = useScrollHeightAndWidth(buttons.length)

  return (
    <>
      {!showFiltersForm && (
        <>
          

          <div
            className={
              'list__container ' +
              (showMap ? '' : ' list__container--full-list')
            }
            onScroll={handleScrollHeight}
          >

            <div 
              className={
                'list__order ' +
                (showMap ? '' : ' list__order--full-screen')
              }
            
            >
              <>
                {/* <div>{t('buttonFilters.orderBy')}</div> */}

                <AdvancedFiltersSortDropDown
                  className={'dropdown__dropdown-trigger--list'}
                  orderBy={filters.orderBy}
                  setOrderBy={(value) => updatesOrderByFilters(value)}
                  buttonTypes={buttonTypes}
                  selectedButtonTypes={filters.helpButtonTypes}
                />
              </>
              
              <div
                  onClick={handleChange}
                  className={
                    'drag-tab ' + (showLeftColumn ? '' : 'drag-tab--open') +  (showMap ? '' : 'drag-tab--hide')
                  }
                >
                  <span className="drag-tab__line"></span>

                  <div className="drag-tab__icon">
                    {showLeftColumn ? (
                      <IoChevronBackOutline />
                    ) : (
                      <IoChevronForwardOutline />
                    )}
                  </div>
                </div>

              <ShowMobileOnly>
                
                <div className="list__show-map-button">
                  <Btn
                    btnType={BtnType.filterCorp}
                    iconLeft={IconType.svg}
                    iconLink={<IoMapOutline />}
                    contentAlignment={ContentAlignment.center}
                    caption={t(showMapCaption)}
                    onClick={handleChangeShowMap}
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
