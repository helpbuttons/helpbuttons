import {
  IoAddCircleOutline,
  IoChatbubbleOutline,
} from 'react-icons/io5';
import { NotificationCard } from '..';
import t from 'i18n';
import { readableDate } from 'shared/date.utils';

export default function ActivityCardNewButton({ button, isRead }) {
  const notifIcon = <IoAddCircleOutline />;

  return (
    <NotificationCard
      type={t('activities.newbuttonType')}
      image={button.image}
      notifIcon={notifIcon}
      date={button.created_at}
      buttonId={button.id}
      title={t('activities.newbutton', [button.address], true)}
      message={button.title}
      read={isRead}
    />
  );
}

export function ActivityCardDeleteButton({ button, isRead, date }) {
  const notifIcon = <IoAddCircleOutline />;
  return (
    <NotificationCard
      type={t('activities.deletedType')}
      notifIcon={notifIcon}
      image={button.image}
      date={date}
      buttonId={button.id}
      title={t('activities.deletebutton', [button.title], true)}
      read={isRead}
    />
  );
}

export function ActivityCardNewFollowingButton({
  button,
  follower,
  isRead,
  date,
  buttonTypes,
}) {
  const notifIcon = <IoChatbubbleOutline />;

  return (
    <>
      {buttonTypes?.length > 0 && (
        <NotificationCard
          type={t('activities.newfollowType')}
          title={t(
            'activities.newfollowing',
            [
              buttonTypes.find(
                (btnType) => btnType.name == button.type,
              ).caption,
            ],
            false,
          )}
          image={follower.avatar}
          notifIcon={notifIcon}
          date={date}
          buttonId={button.id}
          message={button.title}
          read={isRead}
        />
      )}
    </>
  );
}

export function ActivityCardNewFollowedButton({
  button,
  followed,
  isRead,
  date,
  buttonTypes,
}) {
  const notifIcon = <IoChatbubbleOutline />;

  return (
    <>
      {buttonTypes?.length > 0 && (
        <NotificationCard
          type={t('activities.newfollowType')}
          title={t(
            'activities.newfollowed',
            [
              followed.username,
              buttonTypes.find(
                (btnType) => btnType.name == button.type,
              ).caption,
            ],
            false,
          )}
          image={followed.avatar}
          notifIcon={notifIcon}
          date={date}
          buttonId={button.id}
          message={button.title}
          read={isRead}
        />
      )}
    </>
  );
}

export function ActivityCardExpiredButton({ button, isRead, date }) {
  const notifIcon = <IoChatbubbleOutline />;

  return (
    <NotificationCard
      type={t('activities.expiredEventType')}
      title={t('activities.expiredEventTitle', [
        button.title,
        readableDate(new Date(button.eventEnd)),
      ])}
      image={button.image}
      notifIcon={notifIcon}
      date={date}
      buttonId={button.id}
      read={isRead}
    />
  );
}

// functions to support depecrated activities

export const getButtonActivity = (rawData) => {
  function parse(rawData) {
    try {
      return JSON.parse(rawData).button;
    } catch (err) {console.log('failed to parse'); console.log(err)}
  };
  return rawData.button
    ? rawData.button
    : parse(rawData)
};
