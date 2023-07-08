///button marker over the map
import React from 'react';

import router from 'next/router';

import CardButtonList from 'components/list/CardButtonList'
import t from 'i18n';
import Btn, { ContentAlignment } from 'elements/Btn';

export default function ContentList ({buttons, ...props}) {

  if (buttons.length < 1) {
    return (
      <>
      <div className='list__empty-message'>
        <div className='list__empty-message--prev'>
        {t('explore.noResults')}
        </div>
        {t('explore.emptyList')}
        <Btn caption={t('explore.createEmpty')} onClick={() => router.push('/ButtonNew')} contentAlignment={ContentAlignment.center}/>
      </div>
      </>
    );
  }
  const markers = buttons.map((btn, i) => (

      <CardButtonList key={i} button={btn}/>

  ));

  return markers;
};
