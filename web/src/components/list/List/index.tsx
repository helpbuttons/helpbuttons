//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import React, { useEffect, useState } from 'react';
import { IoClose, IoList, IoMap, IoMapOutline } from 'react-icons/io5';
import ContentList from 'components/list/ContentList';
import t from 'i18n';
import {
  AdvancedFiltersSortDropDown,
} from 'components/search/AdvancedFilters';
import { GlobalState, store } from 'pages';
import { useStore } from 'store/Store';
import { ExploreViewMode, UpdateExploreViewMode, UpdateFilters } from 'state/Explore';
import { useScrollHeightAndWidth } from 'elements/scroll';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import { ShowDesktopOnly, ShowMobileOnly } from 'elements/SizeOnly';
import { Dropdown } from 'elements/Dropdown/Dropdown';
import { useButtonTypes } from 'shared/buttonTypes';
import DraggableList from '../DraggableList';


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
  const viewMode = useStore(
    store,
    (state: GlobalState) => state.explore.settings.viewMode,
    false,
  );
  const showAdvancedFilters = useStore(
    store,
    (state: GlobalState) => state.explore.map.showAdvancedFilters,
    false
  );

  const hexagonClicked = useStore(
    store,
    (state: GlobalState) => state.explore.settings.hexagonClicked
  )

  const showMapIcon = showMap
  ? <IoClose/>
  : <IoMapOutline/>;

  const handleChangeShowMap = (event) => {
    toggleShowMap(event.target.value);
    setListOpen(false);
    onLeftColumnToggle(false);
    setListFullScreen(false);
  };

  const updatesOrderByFilters = (value) => {
    const newFilters = { ...filters, orderBy: value };
    store.emit(new UpdateFilters(newFilters));
  };

  useEffect(() => {
    switch (viewMode) {
      case ExploreViewMode.MAP: {
        toggleShowMap(true);
        onLeftColumnToggle(false);
        setListOpen(false);
        setListFullScreen(false);    
        break;
      }
      case ExploreViewMode.LIST: {
        toggleShowMap(false);
        onLeftColumnToggle(true);
        setListOpen(true);
        setListFullScreen(true);   
        break;
      }
      default:
      case ExploreViewMode.BOTH: {
        toggleShowMap(true);
        onLeftColumnToggle(true);  
        setListOpen(true);
        setListFullScreen(false);   
        break;
      }
    }
  }, [viewMode])

  useEffect(() => {
    
    if (hexagonClicked)
    {
      console.log(isListOpen)
      setListOpen(() => true)
    }else{
      // setListOpen(() => false)
    }
  }, [hexagonClicked])

  const leftColumnToggle = (event, value) => {
    onLeftColumnToggle(event.target.value);

  };

  const [isListFullScreen, setListFullScreen] = useState<boolean>(false);
  const [isListOpen, setListOpen] = useState<boolean>(true);

  const toggleListOpen = (value1, value2) => {
    setListOpen(value1);
    setListFullScreen(value2);
  };

  const buttonTypes = useButtonTypes();

  const {sliceSize, handleScrollHeight, handleScrollWidth} = useScrollHeightAndWidth(buttons.length)

  let dropdownExploreViewOptions = [
    {
      value: ExploreViewMode.BOTH,
      name: t("explore.both"),
    },
    {
      value: ExploreViewMode.MAP,
      name:  t("explore.map"),
    },
    {
      value: ExploreViewMode.LIST,
      name:  t("explore.list"),
    },
  ]

  return (
    <>
      {!showAdvancedFilters && (
        <>
          <ShowMobileOnly>
            <DraggableList  
              className={'list__container '} 
              onScroll={handleScrollHeight} 
              initialPos={{
                x: 0,
                y: window.innerHeight - 110,
              }} 
              onFullScreen={toggleListOpen}
              isListOpen={isListOpen}
              isListFullScreen={isListFullScreen}
            >
              {/* <div className={ 'list__container ' + (showMap ? '' : ' list__container--full-screen')} onScroll={handleScrollHeight}> */}

                <div className={ 'list__order list__order--full-screen '} >
                  <div className='drag-tab__line'></div>

                  {/* {showLeftColumn &&
                    <AdvancedFiltersSortDropDown
                      className={'dropdown__dropdown-trigger--list'}
                      orderBy={filters.orderBy}
                      setOrderBy={(value) => updatesOrderByFilters(value)}
                      buttonTypes={buttonTypes}
                      selectedButtonTypes={filters.helpButtonTypes}
                    />
                  } */}
                  {isListOpen &&
                        <AdvancedFiltersSortDropDown
                          className={'dropdown__dropdown-trigger--list'}
                          orderBy={filters.orderBy}
                          setOrderBy={(value) => updatesOrderByFilters(value)}
                          buttonTypes={buttonTypes}
                          selectedButtonTypes={filters.helpButtonTypes}
                        />
                  }
                  {isListFullScreen &&  
                        <Btn
                          btnType={BtnType.smallLink}
                          // extraClass='dropdown__dropdown-trigger--list'
                          // iconLeft={IconType.svg}
                          iconLink={<IoMap />}
                          contentAlignment={ContentAlignment.left}
                          caption={t("explore.showMap")}
                          onClick={toggleListOpen}
                        />
                  }


                </div>
                <div
                  className={
                    'list__content list__content--full-screen ' 
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
              {/* </div>     */}
            </DraggableList>
          </ShowMobileOnly>
          <ShowDesktopOnly>
            <div className={ 'list__container ' + (showMap ? '' : ' list__container--full-screen')} onScroll={handleScrollHeight}>
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
                    <div onClick={leftColumnToggle} className={'drag-tab ' + (showLeftColumn ? '' : 'drag-tab--open') +  (showMap ? '' : 'drag-tab--hide')}>
                      <span className="drag-tab__line"></span>
                      <div className="drag-tab__icon">
                        {(!showLeftColumn) ? (
                          <Btn
                          btnType={BtnType.link}
                          iconLeft={IconType.svg}
                          iconLink={<IoList />}
                          contentAlignment={ContentAlignment.center}
                          caption={t("explore.showList")}
                          onClick={() => store.emit(new UpdateExploreViewMode(ExploreViewMode.BOTH))}
                            />
                        ) : (
                          <Btn
                          btnType={BtnType.link}
                          iconLeft={IconType.svg}
                          iconLink={<IoClose />}
                          contentAlignment={ContentAlignment.center}
                          caption={t("explore.hideList")}
                          onClick={() => store.emit(new UpdateExploreViewMode(ExploreViewMode.MAP))}
                          />
                        )}
                      </div>
                    </div>
                </div>
              <div
                className={
                  'list__content ' +
                  (showMap
                    ? 'list__content--mid-screen'
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
          </ShowDesktopOnly>
        </>
      )}
    </>
  );
}

export default List;
