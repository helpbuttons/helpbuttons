//feed page for a determine button (id), you can see the private or group cfeed in this URL
import { GlobalState, store } from 'pages';
import { useEffect } from 'react';
import { ActivityMarkAllAsRead, FindActivities } from 'state/Activity';
import { useRef } from 'store/Store';
import { alertService } from 'services/Alert';
import t from 'i18n';
import ActivityLayout from 'layouts/Activity';

export default function Activity() {
  const unreadActivities = useRef(
    store,
    (state: GlobalState) => state.unreadActivities,
  );
  const activities = useRef(
    store,
    (state: GlobalState) => state.activities,
  );
  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
    false,
  );

  useEffect(() => {
      if(unreadActivities> 0){
        alertService.info(t('activities.markedAllAsRead'))
        store.emit(new ActivityMarkAllAsRead())
      }
  }, [unreadActivities]);

  useEffect(() => {
    store.emit(
      new FindActivities(),
    );
  }, [])

  return (
    <>
      {activities && loggedInUser && (
        <ActivityLayout
          allActivities={activities}
          loggedInUser={loggedInUser}
        />
      )}
    </>
  );
}
