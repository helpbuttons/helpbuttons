import Btn, { BtnType, ContentAlignment } from 'elements/Btn';

import t from 'i18n';
import { useEffect, useState } from 'react';
import { useButtonTypes } from 'shared/buttonTypes';
import MultiSelectOption from 'elements/MultiSelectOption';
import { uniqueArray } from 'shared/sys.helper';
import { ActivityMessageList } from 'components/feed/ActivityMessage/ActivityMessageList';
import { ActivityNotificationList } from 'components/feed/ActivityNotification/ActivityNotificationList';
import Accordion from 'elements/Accordion';
import FieldMultiSelect from 'elements/Fields/FieldMultiSelect';
import { IoList } from 'react-icons/io5';
import { useActivities } from 'state/Activity';

export default function ActivityLayout({ sessionUser }) {
  const { notifications, messages } = useActivities();
  const [countUnreadNotifications, setCountUnreadNotifications] =
    useState(0);
  const [countUnreadMessages, setCountUnreadMessages] =
  useState(0);
  const buttonTypes = useButtonTypes();
  const [selectedButtonTypes, setSelectedButtonTypes] =
    useState(null);
  const setButtonTypeValue = (name, value) => {
    if (value) {
      setSelectedButtonTypes(() =>
        uniqueArray([...buttonTypes, name]),
      );
      return;
    }
    setSelectedButtonTypes(() =>
      uniqueArray(
        buttonTypes.filter((prevValue) => prevValue != name),
      ),
    );
  };
  useEffect(() => {
    const countMessages = messages?.unread?.length > 0 ?  messages.unread.length : 0;
    const countNotifications = notifications?.unread?.length > 0 ?  notifications.unread.length : 0;
    setCountUnreadNotifications(
      countNotifications
    );
    setCountUnreadMessages(
      countMessages
    );
  }, [notifications, messages]);
  useEffect(() => {
    if (buttonTypes && !selectedButtonTypes) {
      setSelectedButtonTypes(() => buttonTypes);
    }
  }, [buttonTypes]);
  enum ActivityTab {
    MESSAGES,
    NOTIFICATIONS,
  }

  const [activitySelectedTab, setSelectedTab] = useState(
    ActivityTab.MESSAGES,
  );
  return (
    <div className="feed__container">
      <div className="feed-selector feed-selector--list-toggle">
        <div className='feed-selector__toggle-button'>
        {countUnreadNotifications > 0 && 
          <span className='notif-circle feed-selector__notif-circle'>1</span>
        }
          <Btn
            caption={t('activities.messages')}
            btnType={BtnType.tab}
            contentAlignment={ContentAlignment.center}
            extraClass={
              activitySelectedTab == ActivityTab.MESSAGES &&
              'btn--tab-active'
            }
            onClick={() => setSelectedTab(() => ActivityTab.MESSAGES)}
          />
        </div>
        <div className='feed-selector__toggle-button'>
          {countUnreadMessages > 0 && 
           <span className='notif-circle feed-selector__notif-circle'>1</span>
          }
          <Btn
            caption={t('activities.notifications')}
            btnType={BtnType.tab}
            contentAlignment={ContentAlignment.center}
            extraClass={
              activitySelectedTab == ActivityTab.NOTIFICATIONS &&
              'btn--tab-active'
            }
            onClick={() =>
              setSelectedTab(() => ActivityTab.NOTIFICATIONS)
            }
          />
        </div>
      </div>
      {false && (
      <div className="feed-selector feed-selector--activity">
        
          <Accordion icon={<IoList />} title={t('feed.byCategory')}>
            <FieldMultiSelect
              label={t('buttonFilters.types')}
              validationError={null}
              explain={t('buttonFilters.typesExplain')}
            >
              {buttonTypes &&
                selectedButtonTypes &&
                buttonTypes.map((buttonType) => {
                  return (
                    <MultiSelectOption
                      key={buttonType.name}
                      defaultValue={selectedButtonTypes.find(
                        (_buttonType) =>
                          _buttonType.name == buttonType.name,
                      )}
                      iconLink={buttonType.icon}
                      color={buttonType.cssColor}
                      icon="emoji"
                      name={buttonType.name}
                      handleChange={(name, newValue) => {
                        setButtonTypeValue(name, newValue);
                      }}
                    >
                      <div className="btn-with-icon__text">
                        {buttonType.caption}
                      </div>
                    </MultiSelectOption>
                  );
                })}
            </FieldMultiSelect>
          </Accordion>
      </div>
      )}
      {activitySelectedTab == ActivityTab.MESSAGES && (
        <ActivityMessageList />
      )}

      {activitySelectedTab == ActivityTab.NOTIFICATIONS && (
        <ActivityNotificationList />
      )}
    </div>
  );
}
