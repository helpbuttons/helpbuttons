import { GlobalState, store } from 'state';
import { catchError, map } from 'rxjs';
import { ButtonService } from 'services/Buttons';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { handleError } from './helper';
import produce from 'immer';
import dconsole from 'shared/debugger';
import { ButtonEntry } from 'shared/dtos/button.dto';
import { FindLatestActivities } from './Activity';
import { StoreFindButtons } from './Explore';

export class FollowButton implements WatchEvent, UpdateEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) { }
  public watch(state: GlobalState) {
    return ButtonService.follow(this.buttonId).pipe(
      map((data) => {
        this.onSuccess();
        store.emit(new StoreFindButtons([{...state.explore.currentButton, isFollowing: true, followCount: state.explore.currentButton.followCount + 1 } ]))
        // store.emit(new UpdateListButton(this.buttonId, { isFollowing: true, followCount: state.explore.currentButton.followCount + 1 })) 
        store.emit(new FindLatestActivities())
      }),
        
      catchError((error) => handleError(this.onError, error)),
    );
  }

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton.isFollowing = true
    });
  }
}

export class UnfollowButton implements WatchEvent, UpdateEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) { }
  public watch(state: GlobalState) {
    return ButtonService.unfollow(this.buttonId).pipe(
      map((data) => { this.onSuccess(); 
        store.emit(new StoreFindButtons([{...state.explore.currentButton, isFollowing: false, followCount: state.explore.currentButton.followCount - 1 } ]))
      }),
      catchError((error) => handleError(this.onError, error)),
    );
  }

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton.isFollowing = false;
    });
  }
}
