import { GlobalState } from 'pages';
import { PostService } from 'services/Post';
import { MessageDto } from 'shared/dtos/post.dto';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { catchError, map } from 'rxjs/operators';
import { handleError } from './helper';
import { CommentPrivacyOptions } from 'shared/types/privacy.enum';
import { produce } from 'immer';

export class CreateNewPost implements WatchEvent {
  public constructor(
    private buttonId: string,
    private data: MessageDto,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return PostService.new(this.buttonId, this.data).pipe(
      map((data) => this.onSuccess(data)),
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class SaveDraftNewPostComment implements UpdateEvent {
  public constructor(private postId: string,
    private data: any) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.draftNewCommentPost = {postId: this.postId, data: this.data};
    });
  }
}

export class ClearDraftNewPostComment implements UpdateEvent {
  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.draftNewCommentPost = null
    });
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

export class CreateNewPostComment implements WatchEvent, UpdateEvent {
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
  
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton.followedBy = [...state.explore.currentButton.followedBy,state.loggedInUser.id]
      newState.explore.map.boundsFilteredButtons = []
      newState.explore.map.cachedHexagons = []
      newState.explore.map.listButtons = []
    });
  }
}

export class CreateNewCommentReply implements WatchEvent, UpdateEvent {
  public constructor(
    private postId: string,
    private commentId: string,
    private privacy: CommentPrivacyOptions,
    private message,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return PostService.newCommentReply(this.postId, this.commentId, this.privacy, this.message).pipe(
      map((data) => this.onSuccess(data)),
      catchError((error) => handleError(this.onError, error)),
    );
  }
  
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton.followedBy = [...state.explore.currentButton.followedBy,state.loggedInUser.id]
      newState.explore.map.boundsFilteredButtons = []
      newState.explore.map.cachedHexagons = []
      newState.explore.map.listButtons = []
    });
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
