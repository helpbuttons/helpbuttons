import produce from 'immer';
import { GlobalState } from 'pages';
import { UpdateEvent } from 'store/Event';

export interface Alert {
    id: number,
    type: string,
    options: any,
    message: string
}

export class AddAlert implements UpdateEvent {
  public constructor(private currentAlert: Alert) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      this.currentAlert.id = state.alerts.length + 1;
      newState.alerts.push(this.currentAlert);
    });
  }
}

export class RemoveAlert implements UpdateEvent {

  public constructor(private alertId: number) {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.alerts = newState.alerts.filter((alert) => {
        return alert.id != this.alertId;
      });
    });
  }
}


export class RemoveAllAlerts implements UpdateEvent {

  public constructor() {}

  public update(state: GlobalState) {
    return produce(state, newState => {
      newState.alerts = [];
    });
  }
}