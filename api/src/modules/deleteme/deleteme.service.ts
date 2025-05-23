import { Injectable } from '@nestjs/common';
import { ButtonService } from '../button/button.service.js';
import { ActivityService } from '../activity/activity.service.js';
import { CommentService } from '../post/comment.service.js';
import { PostService } from '../post/post.service.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class DeletemeService {
  constructor(private readonly buttonService: ButtonService,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
    private readonly activityService: ActivityService,
    private readonly userService: UserService) {}

  async deleteme(user) {
    console.log("deleting user : " + user.id)
    await this.buttonService.deleteme(user.id)
    await this.commentService.deleteme(user.id)
    await this.postService.deleteme(user.id)
    await this.activityService.deleteme(user.id)
    await this.userService.deleteme(user)
  }
}
