import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import { alertService, AlertType } from 'services/Alert';

import { IoSadOutline } from "react-icons/io5";
import { IoInformationCircleOutline } from "react-icons/io5";
import { IoHappyOutline } from "react-icons/io5";
import { IoWarningOutline } from "react-icons/io5";

import { IoCloseOutline } from "react-icons/io5";
import { useRef } from 'store/Store';
import { GlobalState, store } from 'state';
import { RemoveAlert } from 'state/Alerts';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';


export default Alert;

Alert.propTypes = {
    id: PropTypes.string,
    fade: PropTypes.bool
};

Alert.defaultProps = {
    id: 'default-alert',
    fade: true
};

const alertTypeClass = {
  [AlertType.Success]: 'card-alert--success',
  [AlertType.Error]: 'card-alert--error',
  [AlertType.Info]: 'card-alert--info',
  [AlertType.Warning]: 'card-alert--warning',
};
const alertTypeIcon = {
  [AlertType.Success]: <IoHappyOutline />,
  [AlertType.Error]: <IoSadOutline />,
  [AlertType.Info]: <IoInformationCircleOutline />,
  [AlertType.Warning]: <IoWarningOutline />,
};
function Alert({ id, fade }) {
    const router = useRouter();
    const alertas = useRef(store, (state: GlobalState) => state.alerts);

    function cssClasses(alert) {
        if (!alert) return;

        const classes = ['card-alert', 'card-alert'];
        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }

    function iconShape(alert) {
        if (!alert) return;

        return alertTypeIcon[alert.type];
    }

    if (!alertas) return null;
    alertas.forEach(element => {
        setTimeout(() => {
            store.emit(new RemoveAlert(element.id))
        }, 4500)
    });
    return (
        <div className="card-alert__container">
                {alertas.map((alert, index) =>
                    <div key={index} className={cssClasses(alert)}>
                        <div className="card-alert__content">
                          <div className="card-alert__icon">{iconShape(alert)}</div>
                          <span className="card-alert__title" dangerouslySetInnerHTML={{ __html: alert.message }}></span>
                        </div>
                        <Btn
                          btnType={BtnType.smallCircle}
                          iconLink={<IoCloseOutline />}
                          iconLeft={IconType.circle}
                          contentAlignment={ContentAlignment.center}
                          onClick={() => {alertService.clear(alert.id)}}
                        />
                    </div>
                )}
        </div>
    );
}

export function FixedAlert({ alertType = AlertType.Info, message }) {
  return (
    <div className="card-alert__container">
        <div className={alertTypeClass[alertType]+' card-alert'}>
          <div className="card-alert__content">
            <div className="card-alert__icon">
              {alertTypeIcon[alertType]}
            </div>
            <span
              className="card-alert__title"
              dangerouslySetInnerHTML={{ __html: message }}
            ></span>
          </div>
        </div>
    </div>
  );
}
