import Loading from "components/loading"
import Btn, { ContentAlignment } from "elements/Btn"
import t from "i18n"
import router from "next/router"
import { useEffect } from "react"
import { useScroll } from "shared/helpers/scroll.helper"
import { store } from "state"
import { FindMoreActivities } from "state/Activity"
import { ActivityListEntryCard, DraftActivityListEntryCard } from "./ActivityListEntry"


export default function ActivityList({ setSelectedActivity, userActivities, isDrafting }) {
    useEffect(() => {
        store.emit(new FindMoreActivities((loadedActivities) => {}))
    }, [])
    const { endDivLoadMoreTrigger, noMoreToLoad, scrollIsLoading } = useScroll(
        ({ setNoMoreToLoad, setScrollIsLoading }) => {
            setScrollIsLoading(() => true)
            store.emit(new FindMoreActivities((loadedActivities) => {
                if (loadedActivities.length < 1) {
                    setNoMoreToLoad(() => true)
                }
                setScrollIsLoading(() => false)
            }))
        },
    );

    return (<>
        {scrollIsLoading && <Loading />}
        {isDrafting && <DraftActivityListEntryCard/>}
        {userActivities && (
            <div>
                
                {userActivities && <>
                    {[...userActivities].map((activity, idx) => <ActivityListEntryCard activity={activity} setSelectedActivity={setSelectedActivity} key={idx} />)}
                </>
                }
                {(!userActivities || userActivities.length < 1) && (
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
        )}

    </>)

}
