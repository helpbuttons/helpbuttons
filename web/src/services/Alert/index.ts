import { store } from 'pages';
import { AddAlert, RemoveAlert, RemoveAllAlerts } from 'state/Alerts';

export const alertService = {
    success,
    error,
    info,
    warn,
    clear,
    clearAll
};

export const AlertType = {
    Success: 'Success',
    Error: 'Error',
    Info: 'Info',
    Warning: 'Warning'
};

// convenience methods
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
    alert.autoClose = (alert.autoClose === undefined ? true : alert.autoClose);
    store.emit(new AddAlert(alert));
}

// clear alerts
function clear(id : number) {
    store.emit(new RemoveAlert(id))
}

function clearAll(){
    store.emit(new RemoveAllAlerts());
}