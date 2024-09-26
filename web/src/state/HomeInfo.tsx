import produce from 'immer';
import { GlobalState } from 'pages';
import { UpdateEvent } from 'store/Event';

export enum MainPopupPage {
  HIDE = 'hide',
  SIGNUP = 'signup',
  LOGIN = 'login',
  REQUEST_LINK = 'requestLink',
  SHARE = 'share',
}
export interface HomeInfoState {
  mainPopupPage: MainPopupPage;
}

export const homeInfoStateInitial = {
  mainPopupPage: MainPopupPage.HIDE,
};

export class SetMainPopup implements UpdateEvent {
  public constructor(private newPage: MainPopupPage) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.homeInfo.mainPopupPage = this.newPage;
    });
  }
}
