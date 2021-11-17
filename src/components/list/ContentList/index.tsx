///button marker over the map
import React from 'react';
import { map } from 'rxjs/operators';
import { useState } from 'react'

import CardButtonList from 'components/list/CardButtonList'

export default function ContentList ({buttons, ...props}) {

  let buttonArray = buttons.length > 0 ? buttons[0] : buttons;

  const markers = buttonArray.map((btn, i) => (

      <CardButtonList key={btn.id} type={btn.type} userName={btn.owner} images={btn.images} buttonName={btn.name} tags={btn.tags} description={btn.description} date={btn.date} location={btn.geoPlace}/>

  ));

  console.log(markers);

  return markers;
};
