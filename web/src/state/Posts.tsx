import { GlobalState } from 'pages';
import { PostService } from 'services/Post';
import { MessageDto } from 'shared/dtos/post.dto';
import { WatchEvent } from 'store/Event';
import { catchError, map } from 'rxjs/operators';
import { isHttpError } from 'services/HttpService';
import { HttpStatus } from 'shared/types/http-status.enum';
import { of } from 'rxjs';
import { handleError } from './helper';

export class CreateNewPost implements WatchEvent {
  public constructor(
    private buttonId: string,
    private message: MessageDto,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return PostService.new(this.buttonId, this.message).pipe(
      map((data) => this.onSuccess()),
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
    private message,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return PostService.newComment(this.postId, this.message).pipe(
      map((data) => this.onSuccess()),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}
