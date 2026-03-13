import Loading from "components/loading"
import Btn, { ContentAlignment } from "elements/Btn"
import t from "i18n"
import router from "next/router"
import { useScroll } from "shared/helpers/scroll.helper"
import { store } from "state"
import { ActivityMarkAsRead, FindMoreActivities } from "state/Activity"
import { ActivityListEntryCard, DraftActivityListEntryCard } from "./ActivityListEntry"
import { ActivitiesPageSize } from "shared/dtos/activity.dto"
import { ActivityEventName } from "shared/types/activity.list"


export default function ActivityList({ setSelectedActivity, selectedActivity, activities, isDrafting }) {
    const { endDivLoadMoreTrigger, noMoreToLoad, scrollIsLoading } = useScroll(
        ({ setNoMoreToLoad, setScrollIsLoading }) => {
            setScrollIsLoading(() => true)
            store.emit(new FindMoreActivities((loadedActivities) => {
                if (loadedActivities.length < ActivitiesPageSize - 1 ) {
                    setNoMoreToLoad(() => true)
                }
                setScrollIsLoading(() => false)
            }))
        },
    );

    const onActivityClicked = (activity) => {
        
        if([ActivityEventName.Endorsed, ActivityEventName.RoleUpdate, ActivityEventName.EndorseRevoked].indexOf(activity.eventName) !== -1){
            return;
        }
        setSelectedActivity(() => activity) 
        if(!activity.read)
        {
            store.emit(new ActivityMarkAsRead(activity.id))
        }
    }
    return (<>
        {scrollIsLoading && <Loading />}
        {isDrafting && <DraftActivityListEntryCard/>}
        {activities && (
            <>
                
                {activities && <>
                    {[...activities].map((activity, idx) => <ActivityListEntryCard selected={selectedActivity?.id == activity.id} activity={activity} onClick={() => onActivityClicked(activity) } key={idx} />)}
                </>
                }
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
                {/* {noMoreToLoad &&
                    <div className="feed__empty-message">
                        <div className="feed__empty-message--prev">
                            {t('feed.noMoreNotifications')}
                        </div>
                    </div>
                } */}

                {endDivLoadMoreTrigger}
            </>
        )}

    </>)

}
