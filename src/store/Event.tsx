// === Definición de eventos ===

export interface Event {
}

export interface UpdateEvent extends Event {
  public update (state: object): object;
}

export interface WatchEvent extends Event {
  public watch (state: object): Observable<Event>;
}

export function isUpdateEvent(event: Event): boolean {
  return (event.update !== undefined);
}

export function isWatchEvent(event: Event): boolean {
  return (event.watch !== undefined);
}
