import Event  from "../store/Event";
import { BehaviorSubject } from 'rxjs';
// === Definición del Store ===

export class Store {
  public state$: Observable<object>;
  public events$: Observable<Event>;

  public constructor(initialState: object) {
    this.state$ = new BehaviorSubject<object>(initialState).pipe(share());
    this.events$ = new Subject<Event>().pipe(share());
    this._subscribe();
  }

  public emit(event: Event): void {
    this.events$.next(event);
  }

  private _subscribe(): void {
    this.events$.pipe(
      filter(event => isUpdateEvent(event)),
      withLatestFrom(this.state$),
    ).subscribe(this._processUpdateEvent(event, state));

    this.events$.pipe(
      filter(event => isWatchEvent(event)),
      withLatestFrom(this.state$),
    ).subscribe(this._processWatchEvent(event, state));
  }

  private _processUpdateEvent(event: Event, state: object) {
    const newState = event.update(state);
    this.state$.next(newState);
  }

  private _processWatchEvent(event: Event, state: object) {
    const newEvents$ = event.watch(state);
    newEvents$.subscribe(event => this.events$.next(event));
  }
}


// Mejoras:
// - gestión de errores
// - añadir un tipo al estado, en vez de object (ej. export class Store<T>).
// - crear tipo EffectEvent, que hace algún side effect pero no devuelve nada
// - convertir las funciones isXXXEvent en type guards de typescript
// - que WatchEvent.watch pueda devolver una promesa además de un observable
