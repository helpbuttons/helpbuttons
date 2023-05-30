///button marker over the map
import React from 'react';
import { map } from 'rxjs/operators';
import { useState } from 'react'

import CardButtonList from 'components/list/CardButtonList'
import t from 'i18n';

export default function ContentList ({buttons, ...props}) {

  if (buttons.length < 1) {
    return (
      <>
      <div className='list__empty-message'>
        <div className='list__empty-message--prev'>
        {t('explore.noResults')}
        </div>
        {t('explore.emptyList')}
        <button className='btn btn--center list__empty-message--create'>
        {t('explore.createEmpty')}
        </button>
      </div>
      </>
    );
  }
  const markers = buttons.map((btn, i) => (

      <CardButtonList key={i} button={btn}/>

  ));

  return markers;
};
