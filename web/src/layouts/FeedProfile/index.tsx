//FEED SECTION - HERE COMME ALL THE NOTIFFICATIONS, MESSAGES and CONVERSATION LINKS FROM EXTERNAL RESOURCES
import CardNotification from '../../components/feed/CardNotification';
import Dropdown from 'elements/Dropdown/Dropdown';
import Btn, { ContentAlignment } from 'elements/Btn';

import t from 'i18n';
import router from 'next/router';
import { useToggle } from 'shared/custom.hooks';

export default function FeedProfile({ activities, setNotifFilter }) {
  

  const [showSelectFilteredFeed, setShowSelectFilteredFeed] =
    useToggle(false);
  
const dropdownOptions = [
  {
    name: 'Show All Notificactions',
    obj: null,
    onClick: () => {
      setNotifFilter();
      setShowSelectFilteredFeed(true);
    },
  },
  {
    name: 'Show Messages',
    obj: null,
    onClick: () => {
      setNotifFilter();
      setShowSelectFilteredFeed(true);
    },
  },
  {
    name: 'Show Posts',
    obj: null,
    onClick: () => {
      setNotifFilter();
      setShowSelectFilteredFeed(true);
    },
  },
];


  return (
    <div className="feed-container">

      <div className="feed-selector feed-selector--activity">
        <Dropdown  listOption={dropdownOptions}/>
      </div>

      <div className="feed-line"></div>

      <div className="feed-section">
        {activities &&
          activities.map((activity, key) => {
            return (
              <div className="feed-element" key={key}>
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
