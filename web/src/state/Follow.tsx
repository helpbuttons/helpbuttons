import { GlobalState, store } from 'state';
import { catchError, map } from 'rxjs';
import { ButtonService } from 'services/Buttons';
import { WatchEvent } from 'store/Event';
import { handleError } from './helper';
import { FindLatestActivities } from './Activity';
import { updateCurrentButton } from './Explore';

export class FollowButton implements WatchEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) { }
  public watch(state: GlobalState) {
    return ButtonService.follow(this.buttonId).pipe(
      map((data) => {
        this.onSuccess();
        store.emit(new updateCurrentButton({...state.explore.currentButton, isFollowing: true, followCount: state.explore.currentButton.followCount + 1 }))
        store.emit(new FindLatestActivities())
      }),
        
      catchError((error) => handleError(this.onError, error)),
    );
  }
}

export class UnfollowButton implements WatchEvent {
  public constructor(
    private buttonId: string,
    private onSuccess,
    private onError,
  ) { }
  public watch(state: GlobalState) {
    return ButtonService.unfollow(this.buttonId).pipe(
      map((data) => { this.onSuccess(); 
        store.emit(new updateCurrentButton({...state.explore.currentButton, isFollowing: false, followCount: state.explore.currentButton.followCount - 1 }))
      }),
      catchError((error) => handleError(this.onError, error)),
    );
  }

}
