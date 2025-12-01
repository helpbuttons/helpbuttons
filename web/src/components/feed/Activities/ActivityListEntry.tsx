import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import t from "i18n";
import { readableTimeLeftToDate } from "shared/date.utils";
import { GlobalState, store, useGlobalStore } from "state";
import { ActivityMarkAsRead } from "state/Activity";

export function ActivityListEntryCard({ activity, setSelectedActivity }) {
    const markAsRead = (activityId) => {
        store.emit(new ActivityMarkAsRead(activityId))
    }
    return (
        <div className="feed-element">
            <div onClick={() => { setSelectedActivity(() => activity); markAsRead(activity.id) }} className="card-notification">
                <ActivityListEntryCardInner image={activity.image} createdAt={activity.createdAt} type={activity.type} read={activity.read} premessage={activity.premessage} message={activity.message} footer={activity.footer} title={activity.title} />
            </div>
        </div>
    )

}

function ActivityListEntryCardInner({ image, createdAt, type, read, premessage, message, footer, title }) {
    return (
        <div className="card-notification__content">
            <div className="card-notification__avatar">
                <div className="avatar-medium">
                    <ImageWrapper
                        imageType={ImageType.avatarMed}
                        src={image}
                        alt="image"
                    />
                </div>
            </div>
            <div className="card-notification__text">
                <div className="card-notification__header">
                    <div className="card-notification__info">
                        <div className="">{readableTimeLeftToDate(createdAt)}</div>&nbsp;-&nbsp;<div className=""> {type}</div>
                    </div>

                </div>
                <h2 className={`card-notification__title ` + (!read && 'card-notification--unread')}>
                    {title}
                </h2>
                <div className="card-notification__paragraph">
                    <div className={(!read ? 'card-notification--unread' : '')}>
                        {premessage}{message}
                    </div>
                </div>
                <div className="card-notification__footer">
                    {footer}
                </div>
            </div>
        </div>);
}
export function DraftActivityListEntryCard() {
    const draftButton = useGlobalStore(
        (state: GlobalState) => state.activities.draftButton,
    );
    if(!draftButton){
     return <></>
    }
    return (
        <div className="feed-element">
            <div className="card-notification">

                <ActivityListEntryCardInner image={draftButton.image} createdAt={new Date()} type={t('activities.draft')} read={false} premessage={null} message={t('activities.writingDraft')} footer={`${draftButton.title} - ${draftButton.address}`} title={draftButton.owner.name} />
            </div>
        </div>
    )
}