//the button url itself

import CardButton from 'components/button/CardButton';

import Feed from 'layouts/Feed';
import t from 'i18n';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from 'shared/entities/button.entity';
import { GlobalState, store } from 'pages';
import { FindButton, SetAsCurrentButton } from 'state/Explore';
import { alertService } from 'services/Alert';
import { useRef } from 'store/Store';
import { LoadabledComponent } from 'components/loading';
import { current } from 'immer';

export default function ButtonFile() {
  const id = router.query.id;

  const currentButton: Button = useRef(
    store,
    (state: GlobalState) => state.explore.currentButton,
  );
  
  useEffect(() => {
    if (id !== null && !currentButton) {
      store.emit(new SetAsCurrentButton(id));
      store.emit(
        new FindButton(
          id,
          () => {
            console.log('button loaded');
          },
          (errorMessage) => {
            alertService.error(errorMessage);
          },
        ),
      );
    }
    
  }, [id, currentButton]);

  return (
    <LoadabledComponent loading={(!currentButton || (currentButton && !currentButton.id))}>
        <div className="body__content">
          <div className="body__section">
            <CardButton button={currentButton} />
            <Feed button={currentButton}/>
          </div>
        </div>
    </LoadabledComponent>
  );
}
