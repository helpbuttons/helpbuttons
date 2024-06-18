import { Injectable } from '@nestjs/common';
import { ButtonService } from '../button/button.service';
import { ActivityService } from '../activity/activity.service';
import { CommentService } from '../post/comment.service';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

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
