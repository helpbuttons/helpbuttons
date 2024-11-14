import ImageWrapper, { ImageType } from 'elements/ImageWrapper';
import { readableTimeLeftToDate } from 'shared/date.utils';
import { ActivityEventName } from 'shared/types/activity.list';
import {
  IoAddCircleOutline,
  IoChatbubbleOutline,
  IoNotificationsOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import Link from 'next/link';
import { formatMessage } from 'elements/Message';
import t from 'i18n';
import { FindButton, updateCurrentButton } from 'state/Explore';
import { store } from 'pages';
import { buttonColorStyle, useButtonTypes } from 'shared/buttonTypes';
import { useEffect, useState } from 'react';
import { ButtonTemplate } from 'shared/dtos/button.dto';
import ButtonType from 'components/button/ButtonType';
import Loading from 'components/loading';

export default function ActivityNotificationCard({ activity }) {
  return (
    <div>
      {(() => {
        switch (activity.eventName) {
          case ActivityEventName.NewButton: {
            return (
              <NotificationCardCustomIcon
                icon={<IoAddCircleOutline />}
                badgeTitle={t('activities.newbuttonType')}
                activity={activity}
              />
            );
          }

          case ActivityEventName.NewPost: {
            return (
              <NotificationCardCustomIcon
                icon={<IoPersonOutline />}
                badgeTitle={t('activities.creatorUpdate')}
                activity={activity}
              />
            );
          }

          case ActivityEventName.NewPostComment: {
            // its a message.. nothing to do..
            return <></>;
          }

          case ActivityEventName.NewFollowingButton: {
            return (
              <NotificationCardCustomIcon
                icon={<IoChatbubbleOutline />}
                badgeTitle={t('activities.newfollowType')}
                activity={activity}
              />
            );
          }
          case ActivityEventName.NewFollowedButton: {
            return (
              <NotificationCardCustomIcon
                icon={<IoChatbubbleOutline />}
                badgeTitle={t('activities.newfollowType')}
                activity={activity}
              />
            );
          }

          case ActivityEventName.ExpiredButton: {
            return (
              <NotificationCardCustomIcon
                icon={<IoChatbubbleOutline />}
                badgeTitle={t('activities.expiredEventType')}
                activity={activity}
              />
            );
          }

          case ActivityEventName.DeleteButton: {
            return (
              <NotificationCardCustomIcon
                icon={<IoAddCircleOutline />}
                badgeTitle={t('activities.deletedType')}
                activity={activity}
              />
            );
          }

          default: {
            const notifIcon = <IoNotificationsOutline />;

            return (
              <NotificationCard
                title={'activities.notification'}
                notifIcon={notifIcon}
                image={'no'}
                date={activity.created_at}
                message={activity.eventName}
                buttonId={0}
                read={activity.read}
                type="unknown"
              />
            );
          }
        }
      })()}
    </div>
  );
}

export function NotificationCardCustomIcon({
  activity,
  icon,
  badgeTitle,
}) {
  
  return (
    // <>{JSON.stringify(activity)}
    <NotificationCard
      type={badgeTitle}
      image={activity.image}
      notifIcon={icon}
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
      <Link
        href="#"
        onClick={() =>
          store.emit(new FindButton(props.buttonId, (_button) => store.emit(new updateCurrentButton(_button))))
          
        }
        className="card-notification card-notification"
      >
        <InnerNotificationCard
          {...props}
          button
        />
      </Link>
    );
  }

  return <InnerNotificationCard {...props}/>;
}

function InnerNotificationCard({
  notifIcon,
  image,
  read,
  date,
  title,
  message,
  type
}) {
  return (
    <>
      <div
        className="card-notification__comment-count"
        // style={buttonColorStyle('red')}
      >
        <div className="card-notification__label">
          <div className="card-notification__helpbutton-type">
            {/* {buttonType?.icon} */}
            {/* {buttonType.name} */}
          </div>
          {/* <p className="">{'title'}</p> */}
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
          <div className="card-notification__paragraph">
            {message && formatMessage(message)}
          </div>
        </div>
      </div>
      </>
  );
}
