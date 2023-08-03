import CardNotification from '../../components/feed/CardNotification';
import Btn, { ContentAlignment } from 'elements/Btn';

import t from 'i18n';
import router from 'next/router';
import { useToggle } from 'shared/custom.hooks';
import { useState } from 'react';
import { Dropdown } from 'elements/Dropdown/Dropdown';

export default function FeedProfile({ allActivities }) {
  const [activities, setActivities] = useState(allActivities);

  const notificationTypeOptions = [
    {
      name: 'Show All Notificactions',
      value: 'all',
    },
    {
      name: 'Show Messages',
      value: 'message',
    },
    {
      name: 'Show Posts',
      value: 'post',
    },
  ];
  const onChange = (value) => {
    setActivities(() => {
      if (value != 'all') {
        return allActivities.filter(
          (activity) => activity.eventName.indexOf(value) > -1,
        );
      }
      return allActivities;
    });
  };
  return (
    <>
      <div className="feed-selector feed-selector--activity">
        <Dropdown
          options={notificationTypeOptions}
          onChange={onChange}
          defaultSelected={"all"}
        />
      </div>

      <div className="feed-section--activity">
        <div className="feed-section--activity-content">
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
    </>
  );
}
