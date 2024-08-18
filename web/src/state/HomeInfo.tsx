import produce from 'immer';
import { GlobalState } from 'pages';
import { UpdateEvent } from 'store/Event';

export enum EnteringPickerMode {
  HIDE = 'hide',
  SIGNUP = 'signup',
  LOGIN = 'login',
  REQUEST_LINK = 'requestLink'
}
export interface HomeInfoState {
  mode: EnteringPickerMode;
}

export const homeInfoStateInitial = {
  mode: EnteringPickerMode.HIDE,
};

export class SetEnteringMode implements UpdateEvent {
  public constructor(private newMode: EnteringPickerMode) {}

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.homeInfo.mode = this.newMode;
    });
  }
}
