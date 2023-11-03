import { GlobalState } from 'pages';
import { catchError, map } from 'rxjs';
import { ButtonService } from 'services/Buttons';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { handleError } from './helper';
import produce from 'immer';

export class FollowButton implements WatchEvent, UpdateEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.follow(this.buttonId).pipe(
      map((data) => this.onSuccess()),
      catchError((error) => handleError(this.onError, error)),
    );
  }

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton.followedBy = [...state.explore.currentButton.followedBy,state.loggedInUser.id]
    });
  }
}

export class UnfollowButton implements WatchEvent, UpdateEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) {}
  public watch(state: GlobalState) {
    return ButtonService.unfollow(this.buttonId).pipe(
      map((data) => this.onSuccess()),
      catchError((error) => handleError(this.onError, error)),
    );
  }

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      const index = state.explore.currentButton.followedBy.indexOf(state.loggedInUser.id);
      if (index > -1) {
        let followedBy = [...state.explore.currentButton.followedBy];
        followedBy.splice(index,1)
        newState.explore.currentButton.followedBy = followedBy
      }
    });
  }
}
