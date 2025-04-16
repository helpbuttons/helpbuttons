///button marker over the map
import React, { useState } from 'react';

import router from 'next/router';

import CardButtonList from 'components/list/CardButtonList';
import t from 'i18n';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { useScroll } from 'shared/helpers/scroll.helper';
import { FindMoreReadMessages } from 'state/Activity';
import { GlobalState, store } from 'state';
import Loading from 'components/loading';
import { ResetFilters, ToggleAdvancedFilters } from 'state/Explore';
import { useGlobalStore } from 'state';
import { isFiltering } from 'components/search/AdvancedFilters/filters.type';

export default function ContentList({
  buttons,
  buttonTypes,
  showMap = false,
  linkToPopup = true,
  ...props
}) {
  const [buttonsSlice, setButtonsSlice] = useState(2);
  const isLoadingButtons = useGlobalStore(
    (state: GlobalState) => state.explore.map.loading,
  );
  const { endDivLoadMoreTrigger, noMoreToLoad, scrollIsLoading } =
    useScroll(({ setNoMoreToLoad, setScrollIsLoading }) => {
      setScrollIsLoading(() => true);
      if (buttonsSlice < buttons.length) {
        setButtonsSlice(() => buttonsSlice + 2);
      } else {
        setNoMoreToLoad(() => true);
      }
      setScrollIsLoading(() => false);
    });

  if (buttons.length < 1) {
    return (
      <>
        <div className="list__empty-message">
          {isLoadingButtons && <span className='loading__wrapper'><Loading /></span>}
          {!isLoadingButtons && (
            <>
              <div className="list__empty-message--prev">
                {t('explore.noResults')}
              </div>
              <div className="list__empty-message--comment">
                {t('explore.emptyList')}
              </div>
            </>
          )}
          <Btn
            caption={t('explore.createEmpty')}
            onClick={() => router.push('/ButtonNew')}
            contentAlignment={ContentAlignment.center}
          />
        </div>
      </>
    );
  }

  return (
    <>
      {buttons.slice(0, buttonsSlice).map((btn, i) => (
        <CardButtonList
          button={btn}
          key={i}
          buttonTypes={buttonTypes}
          showMap={showMap}
          linkToPopup={linkToPopup}
        />
      ))}
      {noMoreToLoad && <NoMoreToLoad />}
      {endDivLoadMoreTrigger}
    </>
  );
}

export function NoMoreToLoad() {
  const filtered = isFiltering();
  return (
    <div className="list__empty-message">
      <div className="list__empty-message--comment">
        {t('explore.emptyList')}
      </div>
      {filtered && (
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
      <Btn
        caption={t('explore.createEmpty')}
        onClick={() => router.push('/ButtonNew')}
        contentAlignment={ContentAlignment.center}
      />
    </div>
  );
}

export function EndListMessage() {
  return (
    <div className="list__empty-message">
      <div className="list__empty-message--prev">
        {t('explore.noResults')}
      </div>
      <div className="list__empty-message--comment">
        {t('explore.emptyList')}
      </div>
      <Btn
        caption={t('explore.createEmpty')}
        onClick={() => router.push('/ButtonNew')}
        contentAlignment={ContentAlignment.center}
      />
    </div>
  );
}
