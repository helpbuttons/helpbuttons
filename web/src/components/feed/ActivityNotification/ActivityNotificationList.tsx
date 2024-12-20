import t from 'i18n';
import ActivityNotificationCard from './ActivityNotificationCard';
import Btn, { ContentAlignment } from 'elements/Btn';
import router from 'next/router';
import { useRef, useState } from 'react';
import { useScroll } from 'shared/helpers/scroll.helper';
import { store } from 'state';
import Loading from 'components/loading';
import { IoChatbox, IoFootsteps } from 'react-icons/io5';
import { FindMoreNotifications, useActivities } from 'state/Activity';

export function ActivityNotificationList() {

  const { endDivLoadMoreTrigger, noMoreToLoad } = useScroll(
    ({ setNoMoreToLoad, setScrollIsLoading }) => {
      setScrollIsLoading(() => true)
      store.emit(new FindMoreNotifications((notifications) => {
        if (notifications.length < 1) {
          setNoMoreToLoad(() => true)
        }
        setScrollIsLoading(() => false)
      }))
    },
  );

  const { notifications } = useActivities();

  const k = <></>
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
            {noMoreToLoad &&
              <div className="feed__empty-message">
                <div className="feed__empty-message--prev">
                  {t('feed.noMoreNotifications')}
                </div>
              </div>
            }

            {endDivLoadMoreTrigger}
          </div>
        </div>
      )}
    </div>
  );
}
