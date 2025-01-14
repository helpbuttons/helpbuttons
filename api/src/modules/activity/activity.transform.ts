import { ActivityEventName } from '@src/shared/types/activity.list';
import { Activity } from './activity.entity';
import translate, { readableDate } from '@src/shared/helpers/i18n.helper';
import { PrivacyType } from '@src/shared/types/privacy.enum';

export const transformToMessage = (
  activity: Activity,
  userId,
  buttonTypes,
  locale,
) => {
  let activityOut = {
    id: activity.id,
    eventName: activity.eventName,
    read: activity.read,
    createdAt: activity.created_at.toString(),
    title: 'title',
    message: '',
    image: 'image',
    referenceId: 'ddd',
    isPrivate: false,
    isOwner: false
  };

  // Interests MyButton All
  switch (activity.eventName) {
    case ActivityEventName.NewButton: {
      const button = getButtonActivity(activity.data);
      let title = translate(
        locale,
        'activitiesWithSubject.newbutton',
        [button.owner.name, button.address],
      );
      if (userId && userId == button.owner.id) {
        title = translate(locale, 'activities.newbutton', [
          button.address,
        ]);
      }
      const isOwner = button.owner.id == userId;
      return {
        ...activityOut,
        message: button.title,
        title: title,
        image: button.image,
        referenceId: button.id,
        isPrivate: false,
        isOwner: isOwner 
      };
    }
    case ActivityEventName.NewPost: {
      const post = getPostActivity(activity.data);
      const button = post.button;
      if (!post.author.id || !post.button) {
        console.log(
          'post.author.id not found ' + JSON.stringify(activity.data),
        );
      }
      let title = translate(locale, 'activitiesWithSubject.newpost', [
        post.author.name,
        button.title,
      ]);
      if (userId) {
        title = translate(locale, 'activities.newpost', [
          button.title,
        ]);
      }
      const isOwner = post.author.id == userId

      return {
        ...activityOut,
        message: post.message,
        title: title,
        image: button.image,
        referenceId: button.id,
        isPrivate: false,
        isOwner
      };
    }
    case ActivityEventName.NewPostComment: {
      const comment = getCommentActivity(activity.data);
      const button = comment.button;
      if (!comment.author.id || !comment.button) {
        console.log(
          'post.author.id not found ' + JSON.stringify(activity.data),
        );
      }
      let title = translate(locale, 'activities.newcommentType');
      if (comment.privacy == 'private') {
        title = translate(locale, 'activities.newprivatecommentType');
      }
      const isOwner = comment.author.id == userId
      return {
        ...activityOut,
        message: comment.message,
        title: title,
        image: button.image,
        referenceId: button.id,
        isPrivate: comment.privacy == PrivacyType.PRIVATE,
        isOwner: isOwner
      };
    }
    case ActivityEventName.NewFollowingButton: {
      const button = getButtonActivity(activity.data);
      const user = getUserActivity(activity.data)
      return {
        ...activityOut,
        message: button.title,
        title: translate(locale, 'activities.newfollowing', [
          buttonTypes.find((btnType) => btnType.name == button.type)
            .caption,
        ]),
        image: user.image,
        referenceId: button.id,
      };
    }
    case ActivityEventName.NewFollowedButton: {
      const button = getButtonActivity(activity.data);
      const user = getUserActivity(activity.data)
      return {
        ...activityOut,
        message: button.title,
        title: translate(locale,
            'activities.newfollowed',
            [
              user.username,
              buttonTypes.find(
                (btnType) => btnType.name == button.type,
              ).caption,
            ],
          ),
        image: user.image,
        referenceId: button.id,
      };
    }
    case ActivityEventName.ExpiredButton: {
        // TODO
        const button = getButtonActivity(activity.data)
        const isOwner = button.owner.id == userId
        return {
            ...activityOut,
            message: '',
            title: translate(locale,'activities.expiredEventTitle', [
                button.title,
                readableDate(new Date(button.eventEnd))]),
            image: button.image,
            referenceId: button.id,
            isOwner
          };
    }
    case ActivityEventName.DeleteButton: {
        const button = getButtonActivity(activity.data)
        return {
            ...activityOut,
            message: '',
            title: translate(locale, 'activities.deletebutton', [button.title]),
            image: button.image,
            referenceId: button.id,
          };
    }
    default: {
      console.log(
        activity.eventName +
          ' not found on activity.transform, maybe u need to add this notification type?',
      );
      return activityOut;
    }
  }
};

export const getPostActivity = (rawData) => {
  try {
    const data = JSON.parse(rawData);
    return data?.post ? data?.post : data;
  }catch(err)
  {
  }

  try {
    return rawData?.post ? rawData?.post : rawData;
  }catch(err)
  {
    console.log(err)
    console.log('could not parse and it isnt an object', rawData)
  }
  return {}
};

export const getCommentActivity = (rawData) => {
  try {
    const data = JSON.parse(rawData);
    return data.comment;
  }catch(err)
  {
  }

  try {
    return rawData.comment;
  }catch(err)
  {
    console.log(err)
    console.log('could not parse user and it isnt an object', rawData)
  }
  return {}
};

export const getUserActivity = (rawData) => {
  try {
    const data = JSON.parse(rawData);
    return data.user;
  }catch(err)
  {
  }

  try {
    return rawData.user;
  }catch(err)
  {
    console.log(err)
    console.log('could not parse user and it isnt an object', rawData)
  }
  return {}
}
export const getButtonActivity = (rawData) => {
  try {
    const data = JSON.parse(rawData);
    return data?.button ? data?.button : data;
  }catch(err)
  {
  }

  try {
    return rawData?.button ? rawData?.button : rawData;
  }catch(err)
  {
    console.log(err)
    console.log('could not parse button and it isnt an object', rawData)
  }
  return {}
};
