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
