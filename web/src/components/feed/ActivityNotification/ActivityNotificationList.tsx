import t from 'i18n';
import ActivityNotificationCard from './ActivityNotificationCard';
import Btn, { ContentAlignment } from 'elements/Btn';
import router from 'next/router';
import { useRef, useState } from 'react';
import { useScroll } from 'shared/helpers/scroll.helper';
import { store } from 'pages';
import Loading from 'components/loading';
import { IoChatbox, IoFootsteps } from 'react-icons/io5';
import { FindMoreNotifications, useActivities } from 'state/Activity';

export function ActivityNotificationList() {
  const scrollLoading = useRef(false);
  
  const loadMore = () => {
    if (!scrollLoading.current) {
      scrollLoading.current = true;
      store.emit(new FindMoreNotifications((notifications)=> {
        if(notifications.length > 0)
        {
          scrollLoading.current = false;
        }
      }))
    }
  };
  const { notifications } = useActivities();
  const { listEndRef } = useScroll(loadMore);

  return (
    <div className="feed__container">
      {!notifications && <Loading />}
      {notifications && (
        <div className="feed-section--activity">
          <div className="feed-section__title">
              <IoFootsteps />
              {t('feed.activitiesHistory')}
          </div>
          <div className="feed-section--activity-content">
            {notifications &&
              notifications.map((activity, key) => {
                return (
                  <div className="feed-element" key={key}>
                    <ActivityNotificationCard activity={activity} />
                  </div>
                );
              })}
            {(!notifications || notifications.length < 1) && (
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
            <div ref={listEndRef}>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
