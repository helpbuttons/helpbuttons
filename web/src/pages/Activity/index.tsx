//feed page for a determine button (id), you can see the private or group cfeed in this URL
import DebugToJSON from 'elements/Debug';
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { FindActivities } from 'state/Activity';
import { useRef } from 'store/Store';
import NavHeader from '../../components/nav/NavHeader';
import FeedProfile from '../../layouts/FeedProfile';

export default function Activity() {
  const activities = useRef(
    store,
    (state: GlobalState) => state.activities,
  );

  useEffect(() => {
    if (!activities) {
      store.emit(new FindActivities());
    }
  }, [activities]);

  return (
    <>
      <div className="body__content">
        <div className="body__section">
          {activities && <FeedProfile activities={activities} />}
          {!activities && <>nothing in here...</>}
        </div>
      </div>
    </>
  );
}
