//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import React, { useEffect, useRef, useState } from 'react';
import {
  IoClose,
  IoList,
  IoMap,
  IoMapOutline,
} from 'react-icons/io5';
import ContentList from 'components/list/ContentList';
import t from 'i18n';
import { AdvancedFiltersSortDropDown } from 'components/search/AdvancedFilters';
import { GlobalState, store, useGlobalStore } from 'state';
import { useStore } from 'state';
import {
  ExploreViewMode,
  UpdateExploreViewMode,
  UpdateFilters,
} from 'state/Explore';
import Btn, {
  BtnType,
  ContentAlignment,
} from 'elements/Btn';
import { ShowDesktopOnly, ShowMobileOnly } from 'elements/SizeOnly';
import { useButtonTypes } from 'shared/buttonTypes';
import DraggableList from '../DraggableList';
import { ButtonLinkType } from '../CardButtonList';
import Loading from 'components/loading';

function List({
  onLeftColumnToggle,
  buttons,
  showLeftColumn,
  showMap,
  isListOpen,
  setListOpen,
  toggleShowMap = (e) => { },
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
    false,
  );

  const hexagonClicked = useStore(
    store,
    (state: GlobalState) => state.explore.settings.hexagonClicked,
  );

  const showMapIcon = showMap ? <IoClose /> : <IoMapOutline />;

  const updatesOrderByFilters = (value) => {
    const newFilters = { ...filters, orderBy: value };
    store.emit(new UpdateFilters(newFilters));
  };

  const [isListFullScreen, setListFullScreen] =
  useState<boolean>(true);
// const [isListOpen, setListOpen] = useState<boolean>(true);

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
  }, [viewMode]);

  useEffect(() => {
    if (hexagonClicked) {
      setListOpen(() => true);
    } else {
      // setListOpen(() => false)
    }
  }, [hexagonClicked]);



  const toggleListOpen = (value1, value2) => {
    setListOpen(value1);
    setListFullScreen(value2);
  };

  const buttonTypes = useButtonTypes();

  const isLoadingButtons = useGlobalStore(
    (state: GlobalState) => state.explore.map.loading,
  );

  return (
    <>
      <>
        <ShowMobileOnly>
          {!showAdvancedFilters && (
            <DraggableList
              className={'list__container '}
              // initialPos={{
              //   x: 0,
              //   y: window.innerHeight - 110,
              // }}
              onFullScreen={toggleListOpen}
              isListOpen={isListOpen}
              isListFullScreen={isListFullScreen}
              setListOpen={setListOpen}
              viewMode= {ExploreViewMode.LIST}
            >
              <div
                className={
                  'list__order  ' +
                  (isListFullScreen
                    ? ' list__order--full-screen'
                    : '')
                }
              >
                <div className="drag-tab__line"></div>
                {isListOpen && (
                  <AdvancedFiltersSortDropDown
                    className={'dropdown__dropdown-trigger--list'}
                    orderBy={filters.orderBy}
                    setOrderBy={(value) =>
                      updatesOrderByFilters(value)
                    }
                    buttonTypes={buttonTypes}
                    selectedButtonTypes={filters.helpButtonTypes}
                  />
                )}
                {isListFullScreen && (
                  <Btn
                    btnType={BtnType.smallLink}
                    iconLink={<IoMap />}
                    contentAlignment={ContentAlignment.left}
                    caption={t('explore.showMap')}
                    onClick={toggleListOpen}
                  />
                )}
              </div>
              <div
                className={
                  'list__content list__content--full-screen'
                }
              >
                <>{buttonTypes?.length > 0 && (
                  <ContentList
                    buttons={buttons}
                    buttonTypes={buttonTypes}
                    showMap={showMap}
                    linkType={ButtonLinkType.EXPLORE}
                    isLoading={isLoadingButtons}
                    showResetFiltersButton={true}
                  />
                )}</>
              </div>
              {/* </div>     */}
            </DraggableList>
          )}
        </ShowMobileOnly>
        <ShowDesktopOnly>
          <div
            className={
              'list__container ' +
              (showMap ? '' : ' list__container--full-screen')
            }
          >
            <div
              className={
                'list__order ' +
                (showLeftColumn ? '' : ' list__order--hidden') +
                (showMap ? '' : ' list__order--full-screen')
              }
            >
              {showLeftColumn && (
                <AdvancedFiltersSortDropDown
                  className={'dropdown__dropdown-trigger--list'}
                  orderBy={filters.orderBy}
                  setOrderBy={(value) => updatesOrderByFilters(value)}
                  buttonTypes={buttonTypes}
                  selectedButtonTypes={filters.helpButtonTypes}
                />
              )}

              {!showLeftColumn ? (
                <div
                  onClick={() =>
                    store.emit(
                      new UpdateExploreViewMode(ExploreViewMode.BOTH),
                    )
                  }
                  className={
                    'drag-tab ' +
                    (showLeftColumn ? '' : 'drag-tab--open') +
                    (showMap ? '' : 'drag-tab--hide')
                  }
                >
                  <span className="drag-tab__line"></span>
                  <div className="drag-tab__icon">
                    <IoList />
                  </div>
                  {t('explore.showList')}
                </div>
              ) : (
                <div
                  onClick={() =>
                    store.emit(
                      new UpdateExploreViewMode(ExploreViewMode.MAP),
                    )
                  }
                  className={
                    'drag-tab ' +
                    (showLeftColumn ? '' : 'drag-tab--open') +
                    (showMap ? '' : 'drag-tab--hide')
                  }
                >
                  <span className="drag-tab__line"></span>
                  <div className="drag-tab__icon">
                    <IoClose />
                  </div>
                </div>
              )}
            </div>
            <div
              className={
                'list__content ' +
                (showMap
                  ? 'list__content--mid-screen'
                  : 'list__content--full-screen')
              }
            >
              {buttonTypes?.length > 0 && (
                <ContentList
                  buttons={buttons}
                  buttonTypes={buttonTypes}
                  showMap={showMap}
                  linkType={ButtonLinkType.EXPLORE}
                  isLoading={isLoadingButtons}
                  showResetFiltersButton={true}
                />
              )}
            </div>
          </div>
        </ShowDesktopOnly>
      </>
    </>
  );
}

export default List;
