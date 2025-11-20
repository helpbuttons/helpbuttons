export enum ActivityEventName {
  NewButton = 'new.button',
  NewPost = 'new.post',
  NewMention = 'new.mention',
  NewPostComment = 'new.post.comment',
  DeleteButton = 'delete.button',
  NewFollowingButton = 'following.button',
  RenewButton = 'renew.button',
  ExpiredButton = 'expired.button',
  Endorsed = 'user.endorsed',
  EndorseRevoked = 'user.endorseRevoked',
  RoleUpdate = 'user.roleChange',
  NotifyAdmins = 'admin.notify',
  Message = 'message',
  UnfollowButton = 'unfollow.button'
}