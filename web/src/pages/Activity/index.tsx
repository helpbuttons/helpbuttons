//feed page for a determine button (id), you can see the private or group cfeed in this URL
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { ActivityMarkAllAsRead, FindActivities, unreadActivities } from 'state/Activity';
import { useRef } from 'store/Store';
import FeedProfile from '../../layouts/FeedProfile';
import { LoadabledComponent } from 'components/loading';
import { alertService } from 'services/Alert';
import t from 'i18n';

export default function Activity() {
  const unreadActivities = useRef(
    store,
    (state: GlobalState) => state.unreadActivities,
  );
  const activities = useRef(
    store,
    (state: GlobalState) => state.activities,
  );
  useEffect(() => {
      if(unreadActivities> 0){
        alertService.info(t('activity.markedAllAsRead'))
        store.emit(new ActivityMarkAllAsRead())
      }
  }, [unreadActivities]);

  return (
    <>
      <div className="body__content">
        <div className="body__section">
          <LoadabledComponent loading={!activities}>
            <FeedProfile activities={activities} />
          </LoadabledComponent>
        </div>
      </div>
    </>
  );
}
