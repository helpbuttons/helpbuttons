import { GlobalState } from 'pages';
import { catchError, map, of } from 'rxjs';
import { ButtonService } from 'services/Buttons';
import { WatchEvent } from 'store/Event';
import { dbToRRule } from 'components/picker/PickerEventType/recurrent';

export class FindMonthCalendar implements WatchEvent {
  public constructor(
    private month: number,
    private year: number,
    private onSuccess,
  ) {}

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
        console.log(error);
        return of(undefined);
      }),
    );
  }
  
}

export class ButtonModerationList implements WatchEvent {
  public constructor(
    private page: number = 0,
    private onSuccess = undefined,
  ) {}

  public watch(state: GlobalState) {
    return ButtonService.moderationList(this.page).pipe(
      map((moderationList) => { 
        this.onSuccess(moderationList);
      }),
      catchError((error) => {this.onSuccess([]); return  of(undefined)})
    )
  }
}

export class ButtonApprove implements WatchEvent {
  public constructor(
    private buttonId: string,
    private onSuccess = undefined,
  ) {}

  public watch(state: GlobalState) {
    return ButtonService.approve(this.buttonId).pipe(
      map(() => { 
        this.onSuccess();
      }),
      catchError((error) => {return  of(undefined)})
    )
  }
}