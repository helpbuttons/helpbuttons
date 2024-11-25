//feed page for a determine button (id), you can see the private or group cfeed in this URL
'use client'

import { GlobalState, store } from 'pages';
import {  useRef } from 'store/Store';
import ActivityLayout from 'layouts/Activity';

export default function Activity() {
  const sessionUser = useRef(
    store,
    (state: GlobalState) => state.sessionUser,
    false,
  );
  return (
    <>
       <ActivityLayout
          sessionUser={sessionUser}
        />
    </>
  );
}