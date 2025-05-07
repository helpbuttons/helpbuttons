import t from "i18n";
import ActivityNotificationCard from "../ActivityNotification/ActivityNotificationCard";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import router from "next/router";
import { IoAddCircle, IoChatbox } from "react-icons/io5";


export function ActivityList({ activities }) {
    // const buttonTypes = useButtonTypes();
  
    return (
      <>
        {activities &&
          activities.map((activity, key) => {
            return (
              <div className="feed-element" key={key}>
                <ActivityNotificationCard
                  activity={activity}
                />
              </div>
            );
          })}
        {(!activities || activities.length < 1) && (
          <div className="feed__empty-message">
            <div className="feed__empty-message--prev">
              {t('activities.noactivity', ['activities'])}
            </div>
            <Btn
              btnType={BtnType.submit}
              iconLink={<IoAddCircle />}
              iconLeft={IconType.svg}
              caption={t('explore.createEmpty')}
              onClick={() => router.push('/ButtonNew')}
              contentAlignment={ContentAlignment.center}
            />
          </div>
        )}
      </>
    );
  }