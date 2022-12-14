import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { alertService, AlertType } from 'services/Alert';

import { IoSadOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';


export default Alert;

Alert.propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool
};

Alert.defaultProps = {
    id: 'default-alert',
    fade: true
};

function Alert({ id, fade }) {
    const router = useRouter();
    const alertas = useRef(store, (state: GlobalState) => state.alerts);

    function cssClasses(alert) {
        if (!alert) return;

        const classes = ['card-alert', 'card-alert'];

        const alertTypeClass = {
            [AlertType.Success]: 'card-alert--success',
            [AlertType.Error]: 'card-alert--error',
            [AlertType.Info]: 'card-alert--info',
            [AlertType.Warning]: 'card-alert--warning'
        }

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }

    if (!alertas) return null;

    return (
        <div className="card-alert__container">
                {alertas.map((alert, index) =>
                    <div key={index} className={cssClasses(alert)}>
                        <div className="card-alert__content">
                          <div className="card-alert__icon"><IoSadOutline/></div>
                          <span className="card-alert__title" dangerouslySetInnerHTML={{ __html: alert.message }}></span>
                        </div>
                        <a className="btn-circle--small" onClick={() => {alertService.clear(alert.id)}}><IoCloseOutline/></a>
                    </div>
                )}
        </div>
    );
}
