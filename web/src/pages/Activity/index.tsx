//feed page for a determine button (id), you can see the private or group cfeed in this URL
'use client'

import { GlobalState, store } from 'pages';
import {  useRef } from 'store/Store';
import ActivityLayout from 'layouts/Activity';

export default function Activity() {
  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
    false,
  );
  return (
    <>
       <ActivityLayout
          loggedInUser={loggedInUser}
        />
    </>
  );
}