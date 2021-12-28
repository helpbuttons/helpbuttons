// === Definición de eventos ===

export abstract class Event {
}

export abstract class UpdateEvent extends Event {
  public abstract update (state: object): object;
}

export abstract class WatchEvent extends Event {
  public abstract watch (state: object): Observable<Event>;
}

export abstract class EffectEvent extends Event {
  public abstract effect (state: object): void;
}


// === Funciones de tipos ===

export function isUpdateEvent(event: Event): event is Event {
  console.log(event);
  return (event.update !== undefined);
}

export function isWatchEvent(event: Event): event is Event {
  return (event.watch !== undefined);
}

export function isEffectEvent(event: Event): event is Event {
  return (event.effect !== undefined);
}
