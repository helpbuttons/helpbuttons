import { GlobalState } from 'pages';
import { PostService } from 'services/Post';
import { MessageDto } from 'shared/dtos/post.dto';
import { WatchEvent } from 'store/Event';
import { catchError, map } from 'rxjs/operators';
import { handleError } from './helper';
import { CommentPrivacyOptions } from 'shared/types/privacy.enum';
export class CreateNewPost implements WatchEvent {
  public constructor(
    private buttonId: string,
    private message: MessageDto,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return PostService.new(this.buttonId, this.message).pipe(
      map((data) => this.onSuccess(data)),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class LoadPosts implements WatchEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return PostService.findByButtonId(this.buttonId).pipe(
      map((data) => this.onSuccess(data)),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class CreateNewPostComment implements WatchEvent {
  public constructor(
    private postId: string,
    private privacy: CommentPrivacyOptions,
    private message,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return PostService.newComment(this.postId, this.privacy, this.message).pipe(
      map((data) => this.onSuccess()),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class DeletePost implements WatchEvent {
  public constructor(
    private postId: string,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return PostService.delete(this.postId).pipe(
      map((data) => this.onSuccess()),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class DeleteComment implements WatchEvent {
  public constructor(
    private commentId: string,    
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return PostService.deleteComment(this.commentId).pipe(
      map((data) => this.onSuccess()),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}
