import { map } from 'rxjs/operators';
import { produce } from 'immer';

import { WatchEvent } from 'store/Event';
import { UpdateEvent } from '../store/Event';
import { GlobalState } from 'store/Store';

import { ButtonService } from 'services/Buttons';
import { IButton } from 'services/Buttons/button.type';

// import { map, tap, take, catchError } from 'rxjs/operators';
//
// import { localStorageService } from 'services/LocalStorage';


export interface ExploreState {
  visibleButtons: IButton[];
}

export const exploreInitial = {
  visibleButtons: [],
}

export class FindButtons implements UpdateEvent, WatchEvent {
  public constructor(private networkId: string) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.explore.visibleButtons = [];
    });
  }

  public watch(state: GlobalState) {
    return ButtonService.find(this.networkId).pipe(
      map((buttons) => new ButtonsFound(buttons)),
    );
  }
}

export class ButtonsFound implements UpdateEvent {
  public constructor(private buttons: IButton[]) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.explore.visibleButtons = this.buttons;
    });
  }
}

//  export function GetButtonsEvent (setButtons) {
//    const networkId = localStorageService.read("network_id");
//    if (!networkId)
//    {
//     return [];
//    }
//    // Anything in here is fired on component mount.
//    let btns = ButtonService.find(networkId).subscribe(buttons => {
//
//      if (buttons) {
//            // add message to local state if not empty
//            setButtons({ btns: [buttons.response] });
//        } else {
//            // clear messages when empty message received
//            setButtons({ btns: [] });
//        }
//
//    });
//    return () => {
//        // Anything in here is fired on component unmount.
//        btns.unsubscribe();
//    }
//
//  }
