import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { ActivityEventName } from 'shared/types/activity.list';
import { formatMessage } from 'elements/Message';
import { FindButton, } from 'state/Explore';
import { store } from 'state';
import { SetMainPopupCurrentButton } from 'state/HomeInfo';

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
          case ActivityEventName.Endorsed: {
            return (
              <NotificationCardCustomIcon
                activity={activity}
              />
            );
          }
          default: {
            return (
              <NotificationCard
                title={'activities.notification'}
                image={'no'}
                date={activity.created_at}
                message={activity.eventName}
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
  
  return (
    // <>{JSON.stringify(activity)}
    <NotificationCard
      image={activity.image}
      date={activity.createdAt}
      buttonId={activity.referenceId}
      title={activity.title}
      message={activity.message}
      read={activity.read}
    />
    // </>
  );
}

export function NotificationCard(props) {

    if(props.buttonId)
    {

    return (
      <span
        href="#"
        onClick={() =>
          store.emit(new FindButton(props.buttonId, (_button) => {
            store.emit(new SetMainPopupCurrentButton(_button));
          }))
        }
        className="card-notification card-notification"
      >
        <InnerNotificationCard
          {...props}
          button
        />
      </span>
    );
  }

  return <InnerNotificationCard {...props}/>;
}

function InnerNotificationCard({
  image,
  read,
  date,
  title,
  message
}) {
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
              src={image}
              alt="image"
            />
          </div>
        </div>
        <div className="card-notification__text">
          <div className="card-notification__header">
            <div className="card-notification__info">
              <h2 className="card-notification__name">{title}</h2>
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
