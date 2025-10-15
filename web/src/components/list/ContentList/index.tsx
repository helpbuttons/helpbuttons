///button marker over the map
import React, { useState } from 'react';

import router from 'next/router';

import CardButtonList from 'components/list/CardButtonList';
import t from 'i18n';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import { useScroll } from 'shared/helpers/scroll.helper';
import { FindMoreReadMessages } from 'state/Activity';
import { GlobalState, store } from 'state';
import Loading, { LoadingWrapper } from 'components/loading';
import { ResetFilters, ToggleAdvancedFilters } from 'state/Explore';
import { useGlobalStore } from 'state';
import { isFiltering } from 'components/search/AdvancedFilters/filters.type';
import dconsole from 'shared/debugger';
import { IoAccessibility, IoAdd } from 'react-icons/io5';

export default function ContentList({
  buttons,
  buttonTypes,
  showMap = false,
  linkType = null,
  ...props
}) {
  const [buttonsSlice, setButtonsSlice] = useState(2);
  const isLoadingButtons = useGlobalStore(
    (state: GlobalState) => state.explore.map.loading,
  );
  const { endDivLoadMoreTrigger, noMoreToLoad } =
    useScroll(({ setNoMoreToLoad, setScrollIsLoading }) => {
      setScrollIsLoading(() => true);
      if (buttonsSlice < buttons.length) {
        setButtonsSlice(() => buttonsSlice + 2);
      } else {
        // setNoMoreToLoad(() => true);
      }
      setScrollIsLoading(() => false);
    });

  if (buttons.length < 1) {
    return (
      <>
        <div className="list__empty-message">
          {isLoadingButtons && <LoadingWrapper />}
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
          <div className="list__empty-message--button">
            <Btn
              caption={t('explore.createEmpty')}
            iconLeft={IconType.circle}
              iconLink={<IoAdd/>}
              onClick={() => router.push('/ButtonNew')}
              contentAlignment={ContentAlignment.center}
            />
          </div>

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
          linkType={linkType}
        />
      ))}
      <NoMoreToLoad />
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
      <div className="list__empty-message--button">

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
          iconLeft={IconType.circle}
          iconLink={<IoAdd/>}
          contentAlignment={ContentAlignment.center}
        />
      </div>
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
      <div className="list__empty-message--button">
        <Btn
          caption={t('explore.createEmpty')}
          iconLeft={IconType.circle}
          iconLink={<IoAdd/>}
          onClick={() => router.push('/ButtonNew')}
          contentAlignment={ContentAlignment.center}
        />  
       </div>
    </div>
  );
}
