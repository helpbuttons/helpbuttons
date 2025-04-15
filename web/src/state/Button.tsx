import { GlobalState, store } from 'state';
import { catchError, map, of, switchMap } from 'rxjs';
import { ButtonService } from 'services/Buttons';
import { UpdateEvent, WatchEvent } from 'store/Event';
import { dbToRRule } from 'components/picker/PickerEventType/recurrent';
import produce from 'immer';
import { Button } from 'shared/entities/button.entity';
import dconsole from 'shared/debugger';

export class FindMonthCalendar implements WatchEvent {
  public constructor(
    private month: number,
    private year: number,
    private onSuccess,
  ) { }

  public watch(state: GlobalState) {
    return ButtonService.monthCalendar(this.month, this.year).pipe(
      map((monthEvents) =>
        this.onSuccess(
          monthEvents.map((event) => {
            return {
              ...event,
              eventStart: new Date(event.eventStart),
              eventEnd: new Date(event.eventEnd),
              eventData: dbToRRule(event.eventData),
            };
          }),
        ),
      ),
      catchError((error) => {
        dconsole.error(error);
        return of(undefined);
      }),
    );
  }
}

export class ButtonModerationList implements WatchEvent {
  public constructor(
    private page: number = 0,
    private onSuccess = undefined,
  ) { }

  public watch(state: GlobalState) {
    return ButtonService.moderationList(this.page).pipe(
      map((moderationList) => {
        this.onSuccess(moderationList);
      }),
      catchError((error) => {
        this.onSuccess([]);
        return of(undefined);
      }),
    );
  }
}

export class ButtonApprove implements WatchEvent {
  public constructor(
    private buttonId: string,
    private onSuccess = undefined,
  ) { }

  public watch(state: GlobalState) {
    return ButtonService.approve(this.buttonId).pipe(
      map(() => {
        this.onSuccess();
      }),
      catchError((error) => {
        return of(undefined);
      }),
    );
  }
}

export class FindBulletinButtons implements WatchEvent {
  public constructor(
    private page: number,
    private take: number,
    private days: number,
    private onSuccess = undefined,
  ) { }

  public watch(state: GlobalState) {
    return ButtonService.bulletin(this.page, this.take, this.days).pipe(
      map((buttons) => {
        store.emit(new UpdateButtonList(buttons))
        this.onSuccess(buttons);
      }),
      catchError((error) => {
        return of(undefined);
      }),
    );
  }
}

export class UpdateButtonList implements UpdateEvent {
  public constructor(private buttons: Button[]) { }
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.listButtons = this.buttons;
    });
  }
}


export class FindEmbbedButtons implements WatchEvent {
  public constructor(
    private page: number,
    private take: number,
    private days: number,
    private onSuccess = undefined,
  ) { }

  public watch(state: GlobalState) {
    return ButtonService.embbed(this.page, this.take).pipe(
      map((buttons) => {
        store.emit(new UpdateButtonList(buttons))
        this.onSuccess(buttons);
      }),
      catchError((error) => {
        return of(undefined);
      }),
    );
  }
}

export class UpdateButtonPinned implements UpdateEvent {
  public constructor(private buttons: Button[]) { }
  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.map.pinnedButtons = this.buttons;
    });
  }
}

export class FindPinnedButtons implements WatchEvent {
  public constructor(
    private onSuccess = undefined,
  ) { }

  public watch(state: GlobalState) {
    return ButtonService.pinned().pipe(
      map((pinned) => {
        store.emit(new UpdateButtonPinned(pinned))
        this.onSuccess(pinned);
      }),
      catchError((error) => {
        return of(undefined);
      }),
    );
  }
}

export class ButtonPin implements WatchEvent, UpdateEvent {

  public constructor(
    private buttonId: string,
    private onSuccess = undefined,
  ) { }

  public watch(state: GlobalState) {
    return ButtonService.pin(this.buttonId).pipe(
      map(() => {
        this.onSuccess();
      }),
      catchError((error) => {
        return of(undefined);
      }),
    );
  }

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton.pin = true;
      newState.explore.map.pinnedButtons.push(state.explore.currentButton)
    });
  }
}

export class ButtonUnpin implements WatchEvent, UpdateEvent {
  public constructor(
    private buttonId: string,
    private onSuccess = undefined,
  ) { }

  public watch(state: GlobalState) {
    return ButtonService.unpin(this.buttonId).pipe(
      map(() => {
        this.onSuccess();
      }),
      catchError((error) => {
        return of(undefined);
      }),
    );
  }

  public update(state: GlobalState) {
    return produce(state, (newState) => {
      newState.explore.currentButton.pin = false;
      newState.explore.map.pinnedButtons = state.explore.map.pinnedButtons.filter((button) => button.id != state.explore.currentButton.id)
    });
  }
}