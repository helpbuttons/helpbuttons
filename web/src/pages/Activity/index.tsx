//feed page for a determine button (id), you can see the private or group cfeed in this URL
'use client'

import { GlobalState, store, useGlobalStore } from 'state';
import {  useRef } from 'store/Store';
import { ListMessage } from 'components/feed/ListMessage/ListMessage';
import { useEffect } from 'react';
import { FindMoreActivities } from 'state/Activity';

export default function Activity() {
  const sessionUser = useRef(
    store,
    (state: GlobalState) => state.sessionUser,
    false,
  );
  const activities = useGlobalStore((state: GlobalState) => state.activities.activities)
  useEffect(() => {
    store.emit(new FindMoreActivities())
  }, [])
  
  return (
    <>

       <ListMessage activities={activities}/>
       {/* <ActivityLayout
          sessionUser={sessionUser}
        /> */}
    </>
  );
}