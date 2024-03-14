import CardNotification from '../../components/feed/CardNotification';
import Btn, { ContentAlignment } from 'elements/Btn';

import t from 'i18n';
import router from 'next/router';
import { useState } from 'react';
import { Dropdown } from 'elements/Dropdown/Dropdown';
import { ActivityEventName } from 'shared/types/activity.list';
import { Activity } from 'shared/entities/activity.entity';
import { Button } from 'shared/entities/button.entity';
import { Comment } from 'shared/entities/comment.entity';
import { Post } from 'shared/entities/post.entity';

export default function FeedProfile({ allActivities, loggedInUser }) {
  const [activities, setActivities] = useState<Activity[]>(allActivities);

  const notificationTypeOptions = [
    {
      name: t('activities.allNotifications'),
      value: 'all',
    },
    {
      name: t('activities.my'),
      value: 'my',
    },
    {
      name: t('activities.interests'),
      value: 'interests',
    },
    {
      name: t('activities.myhelpbuttons'),
      value: 'myhelpbuttons',
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
  const onChange = (value) => {
    setActivities(() => {
      if (value == 'message') {
        return allActivities.filter(
          (activity) => activity.eventName.indexOf(ActivityEventName.NewPostComment) > -1,
        );
      }
      if (value == 'post') {
        return allActivities.filter(
          (activity) => !(activity.eventName.indexOf(ActivityEventName.NewPostComment) > -1),
        );
      }
      if(value == 'my') {
        // my created buttons
        // my created posts
        // my created comments
        return allActivities.filter(
          (activity: Activity) => 
          {
            switch(activity.eventName)
            {
              case ActivityEventName.NewButton:{
                const button :Button = activity.data
                return button.owner.id == loggedInUser.id
              }
              case ActivityEventName.NewPostComment:{
                const comment : Comment = JSON.parse(activity.data)
                return comment.author.id == loggedInUser.id
              }
              case ActivityEventName.NewPost:
                const post: Post = JSON.parse(activity.data)
                return post.author.id == loggedInUser.id
            }
            return false;
          }
        );
      }
      if(value == 'interests') {
        // interests created buttons on specific tag
        // created post on followed buttons
        return allActivities.filter(
          (activity: Activity) => {
            switch(activity.eventName)
            {
              case ActivityEventName.NewButton:{
                const button :Button = activity.data
                return button.owner.id != loggedInUser.id
              }
              case ActivityEventName.NewPostComment:{
                return false;
              }
              case ActivityEventName.NewPost:
                return false;
                return post.author.id == loggedInUser.id
              case ActivityEventName.NewFollowingButton:
              case ActivityEventName.NewFollowedButton:
                return true;
            }
            return false;
          }
        );
      }
      if(value == 'myhelpbuttons') {
        return allActivities.filter(
          (activity: Activity) => {
            switch(activity.eventName)
            {
              case ActivityEventName.NewButton:{
                const button :Button = activity.data
                return button.owner.id == loggedInUser.id
              }
              case ActivityEventName.DeleteButton:{
                return true;
              }
              default:
                return false;
            }
            return false;
          }
        );
      }
      return allActivities;
    });
  };
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
            {activities &&
              activities.map((activity, key) => {
                return (
                  <div className="feed-element" key={key}>
                    <CardNotification activity={activity} />
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
