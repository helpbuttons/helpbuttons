//FEED SECTION - HERE COMME ALL THE NOTIFFICATIONS, MESSAGES and CONVERSATION LINKS FROM EXTERNAL RESOURCES
import CardNotification from '../../components/feed/CardNotification';
import Dropdown from 'elements/Dropdown/Dropdown';
import Btn, { ContentAlignment } from 'elements/Btn';

import t from 'i18n';
import router from 'next/router';
import { store } from 'pages';
import { ActivitiyMarkAsRead } from 'state/Activity';

export default function FeedProfile({ activities }) {
  
  return (
    <div className="feed-container">
      {/* <div className="feed-selector feed-selector--activity">
        <Dropdown />
      </div> */}
      <div className="feed-line"></div>

      <div className="feed-section">
        {activities &&
          activities.map((activity, key) => {
            return (
              <div className="feed-element" key={key} onClick={() => {
                  // store.emit(new ActivitiyMarkAsRead(activity.id))
                  console.log('oi')
              }}>
                <CardNotification activity={activity} />
              </div>
            );
          })}
        {(!activities || activities.length < 1) && (
          <div className="feed__empty-message">
            <div className="feed__empty-message--prev">
              {t('activities.noactivity', ['activities'])}
            </div>
            <Btn
              caption={t('explore.createEmpty')}
              onClick={() => router.push('/ButtonNew')}
              contentAlignment={ContentAlignment.center}
            />
          </div>
        )}
      </div>
    </div>
  );
}
