import produce from 'immer';
import { GlobalState, store } from 'state';
import { map } from 'rxjs';
import { NetworkService } from 'services/Networks';
import { UserService } from 'services/Users';
import { Button } from 'shared/entities/button.entity';
import { User } from 'shared/entities/user.entity';
import { UpdateEvent, WatchEvent } from 'store/Event';

export enum MainPopupPage {
  HIDE = 'hide',
  SIGNUP = 'signup',
  LOGIN = 'login',
  REQUEST_LINK = 'requestLink',
  SHARE = 'share',
  FAQS = 'faqs',
  PROFILE = 'profile',
}
export interface HomeInfoState {
  mainPopupPage: MainPopupPage;
  mainPopupUserProfile: User;
  mainPopupButton: Button;
  version: string;
  isInstallable: boolean;
}

export const homeInfoStateInitial = {
  mainPopupPage: MainPopupPage.HIDE,
  mainPopupUserProfile: null,
  mainPopupButton: null,
  version: '?',
  isInstallable: false,
};

export class SetMainPopup implements UpdateEvent {
  public constructor(private newPage: MainPopupPage) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.homeInfo.mainPopupPage = this.newPage;
    });
  }
}

export class FindAndSetMainPopupCurrentProfile implements WatchEvent {
  public constructor(private username: string) {}
  public watch(state: GlobalState) {
    return UserService.find(this.username).pipe(
      map((data) => store.emit(new SetMainPopupCurrentProfile(data)))
    );
  }

}
export class SetMainPopupCurrentProfile implements UpdateEvent {
  public constructor(private profile: User) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.homeInfo.mainPopupPage = MainPopupPage.HIDE
      newState.homeInfo.mainPopupUserProfile = this.profile;
      newState.homeInfo.mainPopupButton = null;
    });
  }
}

export class SetMainPopupCurrentButton implements UpdateEvent {
  public constructor(private button: Button) {}
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.homeInfo.mainPopupPage = MainPopupPage.HIDE;
      newState.homeInfo.mainPopupButton = this.button;
      newState.homeInfo.mainPopupUserProfile = null;
    });
  }
}

export class SetIsInstallable implements UpdateEvent{
  public constructor(){}
  public update(state: GlobalState){
    return produce(state, (newState) => {
      newState.homeInfo.isInstallable = true;
    })
  }
}