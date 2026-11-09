export enum ActivityEventName {
  NewButton = 'new.button',
  NewPost = 'new.post',
  NewMention = 'new.mention',
  NewPostComment = 'new.post.comment',
  DeleteButton = 'delete.button',
  NewFollowingButton = 'following.button',
  RenewButton = 'renew.button',
  ExpiredButton = 'expired.button',
  SchedulerExpiredButton = 'schedulerexpired.button',
  Endorsed = 'user.endorsed',
  EndorseRevoked = 'user.endorseRevoked',
  RoleUpdate = 'user.roleChange',
  Message = 'message',
  UnfollowButton = 'unfollow.button',
  EventTomorrow = 'followers.eventtomorrow'
}

export enum GroupActivityEventName {
  AwaitApprovalButton = 'awaitApproval.button',
  EventTomorrow = 'community.eventtomorrow',
  NewUser = "user.new"
}