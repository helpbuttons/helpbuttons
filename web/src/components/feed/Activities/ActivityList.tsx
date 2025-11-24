import Loading from "components/loading"
import Btn, { ContentAlignment } from "elements/Btn"
import ImageWrapper, { ImageType } from "elements/ImageWrapper"
import t from "i18n"
import router from "next/router"
import { useEffect } from "react"
import { readableTimeLeftToDate } from "shared/date.utils"
import { useScroll } from "shared/helpers/scroll.helper"
import { GlobalState, store, useGlobalStore } from "state"
import { ActivityMarkAsRead, FindMoreActivities } from "state/Activity"


export default function ActivityList({ setSelectedActivity, userActivities }) {
    useEffect(() => {
        store.emit(new FindMoreActivities((loadedActivities) => {}))
    }, [])
    const { endDivLoadMoreTrigger, noMoreToLoad } = useScroll(
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

        {!userActivities && <Loading />}
        {userActivities && (
            <div>
                {userActivities && <>
                    {[...userActivities].map((activity, idx) => <ActivityListCard activity={activity} setSelectedActivity={setSelectedActivity} key={idx} />)}
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
export function ActivityListCard({ activity, setSelectedActivity }) {
    const markAsRead = (activityId) => {
        store.emit(new ActivityMarkAsRead(activityId))
    }
    return (
        <div className="feed-element">
            <div onClick={() => {setSelectedActivity(() => activity); markAsRead(activity.id)}} className="card-notification">
                <div className="card-notification__content">
                    <div className="card-notification__avatar">
                        <div className="avatar-medium">
                            <ImageWrapper
                                imageType={ImageType.avatarMed}
                                src={activity.image}
                                alt="image"
                            />
                        </div>
                    </div>
                    <div className="card-notification__text">
                        <div className="card-notification__header">
                            <div className="card-notification__info">
                                <div className="">{readableTimeLeftToDate(activity.createdAt)}</div>&nbsp;-&nbsp;<div className=""> {activity.type}</div>
                            </div>

                        </div>
                        <h2 className={`card-notification__title ` + (!activity?.read && 'card-notification--unread')}>
                            {activity.title}
                        </h2>
                        <div className="card-notification__paragraph">
                            <div className={(!activity?.read ? 'card-notification--unread' : '')}>
                                {activity?.premessage}{activity.message}
                            </div>
                        </div>
                        <div className="card-notification__footer">
                            {activity?.footer}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
