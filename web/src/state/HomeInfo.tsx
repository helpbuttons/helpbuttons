import produce from 'immer';
import { GlobalState, store } from 'state';
import { map } from 'rxjs';
import { UserService } from 'services/Users';
import { Button } from 'shared/entities/button.entity';
import { User } from 'shared/entities/user.entity';
import { UpdateEvent, WatchEvent } from 'store/Event';

export enum MainPopupPage {
  HIDE = 'hide',
  SIGNUP = 'Signup',
  LOGIN = 'Login',
  REQUEST_LINK = 'requestLink',
  SHARE = 'share',
  FAQS = 'faqs',
  PROFILE = 'profile',
  INVITE = 'invite',
  SIGNUP_AS_GUEST = 'signupAsGuest'
}
export enum CookiesState {
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  UNREAD = 'unread',
}
export interface HomeInfoState {
  mainPopupPage: MainPopupPage;
  mainPopupUserProfile: User;
  mainPopupButton: Button;
  version: string;
  isInstallable: boolean;
  pageName: string;
  cookiesState: CookiesState,
  invitationCode: string;
}

export const homeInfoStateInitial = {
  mainPopupPage: MainPopupPage.HIDE,
  mainPopupUserProfile: null,
  mainPopupButton: null,
  version: '?',
  isInstallable: false,
  pageName: '',
  cookiesState: CookiesState.UNREAD,
  invitationCode: null
};

export class SetMainPopup implements UpdateEvent {
  public constructor(private newPage: MainPopupPage) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.homeInfo.mainPopupPage = this.newPage;
      newState.homeInfo.mainPopupButton = null;
      newState.explore.currentButton = null;
      newState.homeInfo.mainPopupUserProfile = null;
    });
  }
}

export class SetInvitationPopup implements UpdateEvent {
  public constructor(private invitationCode) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.homeInfo.mainPopupPage = MainPopupPage.INVITE;
      newState.homeInfo.mainPopupButton = null;
      newState.explore.currentButton = null;
      newState.homeInfo.mainPopupUserProfile = null;
      newState.homeInfo.invitationCode = this.invitationCode;
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
      
      newState.homeInfo.mainPopupUserProfile = null;
      newState.explore.currentButton = this.button;
      newState.homeInfo.mainPopupButton = this.button;
      if(state.homeInfo.pageName == 'Explore' && this.button)
        {
          newState.homeInfo.mainPopupButton = null;
          newState.explore.settings.center = [this.button.latitude,this.button.longitude]
        }
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

export class SetPageName implements UpdateEvent{
  public constructor(private pageName: string){}
  public update(state: GlobalState){
    return produce(state, (newState) => {
      newState.homeInfo.pageName = this.pageName;
    })
  }
}


export class SetCookieState implements UpdateEvent{
  public constructor(private cookieState: CookiesState){}
  public update(state: GlobalState){
    return produce(state, (newState) => {
      newState.homeInfo.cookiesState = this.cookieState;
    })
  }
}