import t from "i18n";
import ActivityNotificationCard from "./ActivityNotificationCard";
import Btn, { ContentAlignment } from "elements/Btn";
import router from "next/router";

export function ActivityNotificationList({ notifications }) {

    return (
      <div className="feed__container">
        <div className="feed-section--activity">
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
          </div>
        </div>
      </div>
    );
  }