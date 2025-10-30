import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { ActivityEventName } from 'shared/types/activity.list';
import { formatMessage } from 'elements/Message';
import { FindButton, } from 'state/Explore';
import { GlobalState, store, useGlobalStore } from 'state';
import { SetMainPopupCurrentButton, SetMainPopupCurrentProfile } from 'state/HomeInfo';
import { FindUser } from 'state/Users';

export default function ActivityNotificationCard({ activity }) {
  return (
    <div>
      {(() => {
        switch (activity.eventName) {
          case ActivityEventName.NewPostComment: {
            // its a message.. nothing to do..
            return <></>;
          }
          case ActivityEventName.NewButton: 
          case ActivityEventName.NewPost: 
          case ActivityEventName.NewFollowingButton: 
          case ActivityEventName.NewFollowedButton: 
          case ActivityEventName.ExpiredButton: 
          case ActivityEventName.DeleteButton: 
          case ActivityEventName.RevokeEndorsed:
          case ActivityEventName.Endorsed:
          case ActivityEventName.RoleUpdate: 
             {
            return (
              <NotificationCardCustomIcon
                activity={activity}
              />
            );
          }
          case ActivityEventName.NotifyAdmins:
            return (
              <NotificationCardCustomIcon
                activity={{...activity, userId: activity.referenceId}}
              />
            );
          default: {
            return (
              <NotificationCard
                title={activity.eventName}
                image={activity.image}
                date={activity.created_at}
                message={activity.title}
                buttonId={0}
                read={activity.read}
              />
            );
          }
        }
      })()}
    </div>
  );
}

export function NotificationCardCustomIcon({
  activity
}) {
  if(activity?.buttonId)
  {
    return (
      <NotificationCard
        image={activity.image}
        date={activity.createdAt}
        onClick={() =>
          store.emit(new FindButton(activity.buttonId, (_button) => {
            store.emit(new SetMainPopupCurrentButton(_button));
          }))}
        title={activity.title}
        message={activity.message}
        read={activity.read}
      />
    );
  }else if(activity?.userId)
    {
      return (
        <NotificationCard
          image={activity.image}
          date={activity.createdAt}
          onClick={() => {store.emit(new FindUser(activity.referenceId, (user) => store.emit(new SetMainPopupCurrentProfile(user))));}}
          title={activity.title}
          message={activity.message}
          read={activity.read}
        />
      );
    }else{
      return (
        <NotificationCard
          image={activity.image}
          date={activity.createdAt}
          title={activity.title}
          message={activity.message}
          read={activity.read}
        />
      );
    }
  
}

export function NotificationCard(props) {

  if (props.onClick) {

    return (
      <span
        href="#"
        onClick={props.onClick}
        className="card-notification card-notification"
      >
        <InnerNotificationCard
          {...props}
          button
        />
      </span>
    );
  }

  return <InnerNotificationCard {...props} />;
}

function InnerNotificationCard({
  image,
  read,
  date,
  title,
  message
}) {
  const sessionUser = useGlobalStore((state: GlobalState) => state.sessionUser);

  return (
    <>
      <div
        className="card-notification__comment-count"
        // style={buttonColorStyle('red')}
      >
        <div className="card-notification__nolabel">
          <div className="card-notification__helpbutton-type">
            {/* {buttonType?.icon} */}
            {/* {buttonType.name} */}
          </div>
          {/* <p className="">{'title'}</p> */}
        </div>
        <div className="card-notification__type">
              {read ? (
                readableTimeLeftToDate(date)
              ) : (
                <div className="card-notification__date">
                  {readableTimeLeftToDate(date)}
                </div>
              )}
        </div>
      </div>
      <div className="card-notification__content">

        <div className="card-notification__avatar">
          <div className="avatar-medium">
            <ImageWrapper
              imageType={ImageType.avatarMed}
              src={image ? image : sessionUser?.avatar}
              alt="image"
            />
          </div>
        </div>
        <div className="card-notification__text">
          <div className="card-notification__header">
            <div className="card-notification__info">
              <div className="card-notification__name">{title}</div>
            </div>

          </div>
          <div className="card-notification__paragraph">
            {message && formatMessage(message)}
          </div>
        </div>
      </div>
      </>
  );
}
