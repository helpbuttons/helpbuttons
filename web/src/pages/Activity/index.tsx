//feed page for a determine button (id), you can see the private or group cfeed in this URL
import { GlobalState, store } from 'pages';
import { useEffect, useState } from 'react';
import { FindActivities } from 'state/Activity';
import { useRef } from 'store/Store';
import FeedProfile from '../../layouts/FeedProfile';
import { LoadabledComponent } from 'components/loading';
import { alertService } from 'services/Alert';

export default function Activity() {
  const activities = useRef(
    store,
    (state: GlobalState) => state.activities,
  );
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activities) {
      store.emit(new FindActivities(() => {
        setLoading(false)
      }, (error) => {
        alertService.error(error);
        setLoading(false)
      }))
    }
  }, [activities]);

  return (
    <>
        <div className="body__content">
      <div className="body__section">
      <LoadabledComponent loading={loading}>
        <FeedProfile activities={activities}/>
      </LoadabledComponent>
      </div>
    </div>
    
    </>
  );
}
