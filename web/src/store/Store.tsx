import { Event, isUpdateEvent, isWatchEvent, isEffectEvent }  from "../store/Event";
import { withLatestFrom, map, share, filter  } from 'rxjs/operators';
import { interval, BehaviorSubject, Subject, Observable} from 'rxjs';
import { useState, useEffect } from 'react';
import { GlobalState } from "state";

// === Definición del Store ===

export class Store<T> {
  public state$: Observable<T>;
  public events$: Observable<Event>;

  public constructor(initialState: T) {
    this.state$ = new BehaviorSubject<T>(initialState);
    this.events$ = new Subject<Event>().pipe(share());
    this._subscribe();
  }

  public emit(event: Event): void {
    this.events$.next(event);
  }

  private _subscribe(): void {
    this.events$.pipe(
      filter((event) => {
        return isUpdateEvent(event);
      }),
      withLatestFrom(this.state$),
    ).subscribe(([event, state]) => this._processUpdateEvent(event, state));

    this.events$.pipe(
      filter((event) => {
        return isWatchEvent(event);
      }),
      withLatestFrom(this.state$),
    ).subscribe(([event, state]) => this._processWatchEvent(event, state));

    this.events$.pipe(
      filter((event) => {
        return isEffectEvent(event);
      }),
      withLatestFrom(this.state$),
    ).subscribe(([event, state]) => this._processEffectEvent(event, state));
  }

  private _processUpdateEvent(event: Event, state: T) {
    const newState = event.update(state);
    this.state$.next(newState);
  }

  private _processWatchEvent(event: Event, state: T) {
    const newEvents$ = event.watch(state);
    if (newEvents$) {
      newEvents$.subscribe(event => this.events$.next(event));
    }
  }

  private _processEffectEvent(event: Event, state: T) {
    event.effect(state);
  }
}


// === Hook para suscribirse al store ===

export function useRef(store: Store<GlobalState>, selector: Function, defaultNull = true) {
  let defaultValue = null;
  if(!defaultNull)
  {
    defaultValue = selector(store.state$.getValue())
  }
  const [value, setValue] = useState(defaultValue);
  useEffect(() => {
    store.state$.subscribe((state) => {
      const newValue = selector(state);
      if (newValue !== value) {
        setValue(selector(state));
      }
    });
  });

  return value;
}