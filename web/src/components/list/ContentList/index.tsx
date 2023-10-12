///button marker over the map
import React from 'react';

import router from 'next/router';

import CardButtonList from 'components/list/CardButtonList';
import t from 'i18n';
import Btn, { ContentAlignment } from 'elements/Btn';

export default function ContentList({
  buttons,
  buttonTypes,
  ...props
}) {
  if (buttons.length < 1) {
    return (
      <>
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
      </>
    );
  }
  return buttons.map((btn, i) => (
    // <>{JSON.stringify(buttonTypes)}</>
    <CardButtonList key={i} button={btn} buttonTypes={buttonTypes} />
  ));
}
