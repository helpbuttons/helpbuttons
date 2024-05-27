import ActivityCardNotification from '../../components/feed/ActivityCardNotification';
import Btn, { ContentAlignment } from 'elements/Btn';

import t from 'i18n';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { Dropdown } from 'elements/Dropdown/Dropdown';
import { ActivityEventName } from 'shared/types/activity.list';
import { Activity } from 'shared/entities/activity.entity';
import { Comment } from 'shared/entities/comment.entity';
import { useButtonTypes } from 'shared/buttonTypes';
import { getButtonActivity } from 'components/feed/ActivityCardNotification/types/button';
import { getCommentActivity, getPostActivity } from 'components/feed/ActivityCardNotification/types/post';

enum NotificationType {
  All,
  MyActivity,
  Interests,
  MyHelpbuttons
}

export default function ActivityLayout({ allActivities, loggedInUser }) {
  const [activities, setActivities] = useState<Activity[]>(allActivities);
  const buttonTypes = useButtonTypes()
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
  // all
  // my activity
    // my created buttons
    // my created posts
    // my created comments
  // my interests activity
    // interests created buttons on specific tag
    // created post on followed buttons
    // i started following a new button X  
  const onChange = (selectedActivityGroup : NotificationType) => {
    setActivities(() => {
      if(selectedActivityGroup == NotificationType.All)
      {
        return allActivities;
      }else if(selectedActivityGroup == NotificationType.MyActivity){
        return allActivities.filter(
          (activity: Activity) => 
          {
            switch(activity.eventName)
            {
              case ActivityEventName.NewButton:{
                const button = getButtonActivity(activity.data)
                return button.owner.id == loggedInUser.id
              }
              case ActivityEventName.NewPostComment:{
                const comment : Comment = getCommentActivity(activity.data)
                return comment.author.id == loggedInUser.id
              }
              case ActivityEventName.NewPost:{
                const post =  getPostActivity(activity.data)
                return post.author.id == loggedInUser.id
              }
              case ActivityEventName.ExpiredButton:{
                const button = getButtonActivity(activity.data)
                return button.owner.id == loggedInUser.id
              }
              case ActivityEventName.DeleteButton:{
                return true;
              }
            }
            return false;
          }
        );
      }else if(selectedActivityGroup == NotificationType.MyHelpbuttons){
        return allActivities.filter(
          (activity: Activity) => {
            switch(activity.eventName)
            {
              case ActivityEventName.NewButton:{
                const button = getButtonActivity(activity.data)
                return button.owner.id == loggedInUser.id
              }
              case ActivityEventName.DeleteButton:{
                return true;
                // return true;
              }
              default:
                return false;
            }
            return false;
          }
        );
      }else if(selectedActivityGroup == NotificationType.Interests){
        return allActivities.filter(
          (activity: Activity) => {
            switch(activity.eventName)
            {
              case ActivityEventName.NewButton:{
                const button = getButtonActivity(activity.data)
                return button.owner.id != loggedInUser.id
              }
              case ActivityEventName.NewFollowingButton:
              case ActivityEventName.NewFollowedButton:
                return true;
            }
            return false;
          })
      }
    })
  }

  return (
      <div className='feed__container'>
        <div className="feed-selector feed-selector--activity">
          <Dropdown
            options={notificationTypeOptions}
            onChange={onChange}
            defaultSelected={"all"}
          />
        </div>
        <div className="feed-section--activity">
          <div className="feed-section--activity-content">
            {/* {JSON.stringify(activities)} */}
            {activities &&
              activities.map((activity, key) => {
                return (
                  <div className="feed-element" key={key}>
                    <ActivityCardNotification activity={activity} buttonTypes={buttonTypes}/>
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
          </div>
        </div>
    </div>
  );
}
