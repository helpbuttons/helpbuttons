import React, { useState } from 'react';
import router from 'next/router';
import CardButtonList from 'components/list/CardButtonList';
import t from 'i18n';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { useScroll } from 'shared/helpers/scroll.helper';
import { store } from 'state';
import { ResetFilters, ToggleAdvancedFilters } from 'state/Explore';
import { isFiltering } from 'components/search/AdvancedFilters/filters.type';
import dconsole from 'shared/debugger';
import Loading from 'components/loading';

export default function ContentList({
  buttons,
  buttonTypes,
  showMap = false,
  linkType = null,
  showCreateNew = true,
  isLoading = false,
  showResetFiltersButton = false,
  browseMapOnEmpty = true,
}) {
  const [buttonsSlice, setButtonsSlice] = useState(2);
  const _showResetFiltersButton = showResetFiltersButton ? isFiltering() : false;
  const { endDivLoadMoreTrigger, noMoreToLoad } =
    useScroll(({ setNoMoreToLoad, setScrollIsLoading }) => {
      setScrollIsLoading(() => true);
      if (buttonsSlice < buttons?.length) {
        setButtonsSlice(() => buttonsSlice + 2);
      } else {
        // setNoMoreToLoad(() => true);
      }
      setScrollIsLoading(() => false);
    });

  if (buttons?.length < 1) {
    return (
      <>
        {isLoading && <Loading/>}
        {!isLoading && 
          <NoMoreToLoad isEmpty={true} showResetFiltersButton={_showResetFiltersButton} showCreateNew={showCreateNew}/>
        }
      </>
    );
  }

  return (
    <>
      {buttons?.slice(0, buttonsSlice).map((btn, i) => (
        <CardButtonList
          button={btn}
          key={i}
          buttonTypes={buttonTypes}
          showMap={showMap}
          linkType={linkType}
        />
      ))}
      <NoMoreToLoad showResetFiltersButton={_showResetFiltersButton} showCreateNew={showCreateNew} browseMapOnEmpty={browseMapOnEmpty}/>
      {endDivLoadMoreTrigger}
    </>
  );
}

export function NoMoreToLoad({isEmpty = false, showResetFiltersButton = false, showCreateNew = false, browseMapOnEmpty = true}) {
  
  return (
    <div className="list__empty-message">
      {isEmpty && 
        <div className="list__empty-message--prev">
            {t('explore.noResults')}
        </div>
      }
      
      <div className="list__empty-message--comment">
        {browseMapOnEmpty ? t('explore.emptyList') : ''}
      </div>
      {showResetFiltersButton && (
        <Btn
          btnType={BtnType.splitIcon}
          caption={t('common.reset')}
          contentAlignment={ContentAlignment.center}
          onClick={(e) => {
            store.emit(new ResetFilters());
            store.emit(new ToggleAdvancedFilters(false));
          }}
        />
      )}
      {showCreateNew && 
        <Btn
          caption={t('explore.createEmpty')}
          onClick={() => router.push('/ButtonNew')}
          contentAlignment={ContentAlignment.center}
        />
      }
    </div>
  );
}