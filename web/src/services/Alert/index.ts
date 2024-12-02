import { store } from 'state';
import { LocalStorageVars, localStorageService } from 'services/LocalStorage';
import { AddAlert, RemoveAlert, RemoveAllAlerts } from 'state/Alerts';

export const alertService = {
  success,
  error,
  info,
  warn,
  clear,
  clearAll,
};

export const AlertType = {
  Success: 'Success',
  Error: 'Error',
  Info: 'Info',
  Warning: 'Warning',
};

function success(message, options = {}) {
  console.info(message);
  alert({ ...options, type: AlertType.Success, message });
}

function error(message, options = {}) {
  console.error(message);
  alert({ ...options, type: AlertType.Error, message });
}

function info(message, options = {}) {
  console.info(message);
  alert({ ...options, type: AlertType.Info, message });
}

function warn(message, options = {}) {
  console.warn(message);
  alert({ ...options, type: AlertType.Warning, message });
}

// core alert method
function alert(alert) {
  alert.autoClose =
    alert.autoClose === undefined ? true : alert.autoClose;
    const hasNotificationPermissions = localStorageService.read(LocalStorageVars.HAS_PERMISSION_NOTIFICATIONS)
 
  if (hasNotificationPermissions) {
    let message = alert.message;
    // switch (alert.type) {
    //   case AlertType.Success:
    //     break;
    //   case AlertType.Error:
    //     message = 'Error: ' + message
    //     break;
    //   case AlertType.Info:
    //     break;
    //   case AlertType.Warning:
    //     message = 'Warning: ' + message
    //     break;
    // }
    new Notification(message);
  } else {
    store.emit(new AddAlert(alert));
  }
}
// clear alerts
function clear(id: number) {
  store.emit(new RemoveAlert(id));
}

function clearAll() {
  store.emit(new RemoveAllAlerts());
}
