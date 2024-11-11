import ActivityCardNotification from '../../components/feed/ActivityCardNotification';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';

import t from 'i18n';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { Dropdown } from 'elements/Dropdown/Dropdown';
import { ActivityEventName } from 'shared/types/activity.list';
import { Activity } from 'shared/entities/activity.entity';
import { ActivityDtoOut, NotificationType } from 'shared/dtos/activity.dto';
import Accordion from 'elements/Accordion';
import { IoList } from 'react-icons/io5';
import FieldMultiSelect from 'elements/Fields/FieldMultiSelect';

export default function ActivityLayout({
  allActivities,
  loggedInUser,
}) {
  const [activities, setActivities] = useState<Activity[]>(allActivities);
  useEffect(() => {
    setActivities(() => allActivities)
  }, [allActivities])
  const notificationTypeOptions = [
    {
      name: t('activities.allNotifications'),
      value: NotificationType.All,
    },
    {
      name: t('activities.my'),
      value: NotificationType.MyActivity,
    },
    {
      name: t('activities.interests'),
      value: NotificationType.Interests,
    },
    {
      name: t('activities.myhelpbuttons'),
      value: NotificationType.MyHelpbuttons,
    },
  ];

  const onChange = (selectedActivityGroup: NotificationType) => {
    setActivities(() => {
      // console.log(allActitvities)
      // return allActivitiest
      if (selectedActivityGroup == NotificationType.All) {
        return allActivities;
      } else if (
        selectedActivityGroup == NotificationType.MyActivity
      ) {
        return allActivities
        .filter((activity: ActivityDtoOut) => {
          switch (activity.eventName) {
            case ActivityEventName.NewButton:
            case ActivityEventName.NewPostComment:
            case ActivityEventName.NewPost: 
            case ActivityEventName.ExpiredButton: {
              return activity.isOwner;
            }
            case ActivityEventName.DeleteButton: {
              return true;
            }
          }
          return false;
        });
      } else if (
        selectedActivityGroup == NotificationType.MyHelpbuttons
      ) {
        return allActivities.filter((activity: ActivityDtoOut) => {
          switch (activity.eventName) {
            case ActivityEventName.NewButton: {
              return activity.isOwner
            }
            case ActivityEventName.DeleteButton: {
              return true;
            }
            default:
              return false;
          }
          return false;
        });
      } else if (
        selectedActivityGroup == NotificationType.Interests
      ) {
        return allActivities.filter((activity: ActivityDtoOut) => {
          switch (activity.eventName) {
            case ActivityEventName.NewButton: {
              return activity.isOwner
            }
            case ActivityEventName.NewFollowingButton:
            case ActivityEventName.NewFollowedButton:
              return true;
          }
          return false;
        });
      }
    });
  };

  return (
    <div className="feed__container">
      <div className="feed-selector feed-selector--list-toggle">
         <Btn
            caption={t('activities.messages')}
            btnType={BtnType.tab}
            contentAlignment={ContentAlignment.center}
          />
          <Btn
            caption={t('activities.notifications')}
            btnType={BtnType.tab}
            contentAlignment={ContentAlignment.center}
            extraClass='btn--tab-active'
          />
      </div>
      <div className="feed-selector feed-selector--activity">
 
        <Accordion icon={<IoList />} title={t('buttonFilters.byCategory')}>
          <FieldMultiSelect
                  label={t('buttonFilters.types')}
                  validationError={null}
                  explain={t('buttonFilters.typesExplain')}
                > 
                  {(helpButtonTypes && buttonTypes) && buttonTypes.map((buttonType) => {
                    return (

                      <MultiSelectOption
                          defaultValue={
                            helpButtonTypes.indexOf(buttonType.name) > -1
                          } 
                          iconLink={buttonType.icon}
                          color={buttonType.cssColor}
                          icon='emoji'
                          name={buttonType.name}
                          handleChange={(name, newValue) => {
                            setButtonTypeValue(name, newValue);
                          }}
                        >
                          {/* <div className="btn-filter__icon"></div> */}
                          <div className="btn-with-icon__text">
                            {buttonType.caption}
                          </div>
                        </MultiSelectOption>

                    //   <div
                    //     key={buttonType.name}
                    //     style={buttonColorStyle(buttonType.cssColor)}
                    //   >
                    //     {/* <div className="btn-filter__icon"></div> */}
                    //     <div className="btn-with-icon__text">
                    //       {buttonType.caption}
                    //     </div>
                    // </div>
                  );
                })}
              </FieldMultiSelect>
            </Accordion>
      </div>
      <div className="feed-section--activity">
        <div className="feed-section--activity-content">
          {/* {JSON.stringify(activities)} */}
          <ActivitiesList activities={activities} />
        </div>
      </div>
    </div>
  );
}

export function ActivitiesList({ activities }) {
  // const buttonTypes = useButtonTypes();

  return (
    <>
      {activities &&
        activities.map((activity, key) => {
          return (
            <div className="feed-element" key={key}>
              <ActivityCardNotification
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
            caption={t('explore.createEmpty')}
            onClick={() => router.push('/ButtonNew')}
            contentAlignment={ContentAlignment.center}
          />
        </div>
      )}
    </>
  );
}
