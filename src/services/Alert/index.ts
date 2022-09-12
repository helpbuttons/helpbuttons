import { store } from 'pages';
import { AddAlert, RemoveAlert } from 'state/Alerts';

export const alertService = {
    success,
    error,
    info,
    warn,
    clear
};

export const AlertType = {
    Success: 'Success',
    Error: 'Error',
    Info: 'Info',
    Warning: 'Warning'
};

// convenience methods
function success(message, options = {}) {
    alert({ ...options, type: AlertType.Success, message });
}

function error(message, options = {}) {
    alert({ ...options, type: AlertType.Error, message });
}

function info(message, options = {}) {
    alert({ ...options, type: AlertType.Info, message });
}

function warn(message, options = {}) {
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
