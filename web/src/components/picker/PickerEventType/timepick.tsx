import { useState } from 'react';
import { IoSaveOutline, IoTimeOutline } from 'react-icons/io5';
import TimeKeeper from 'react-timekeeper';
import t from 'i18n';
import PickerField from '../PickerField';
import Btn, { BtnType, ContentAlignment, IconType } from 'elements/Btn';
import FieldError from 'elements/Fields/FieldError';
import { readableTime } from 'shared/date.utils';

export function TimePick({ time, setTime, minTime = null, maxTime = null, handleChangeToMultipleDates = null, preLabel = '' }) {
  const [showPickerTime, setShowPickerTime] = useState(false);

  const [_time, _setTime] = useState(
    time
      ? time.getHours() +
      ':' +
      String(time.getMinutes()).padStart(2, '1')
      : '12:00',
  );
  const [errorTime, setErrorTime] = useState(0) // 0- no error, -1 minTime bigger, 1 maxTime is lower

  const saveTime = (newTimeDate) => {
    setTime(newTimeDate)
    hidePickTime()
  }
  const getDateFromPickerTime = (pickerTime) => {
    const _date_newTime = pickerTime.split(':').map(Number);
    const newHours = _date_newTime[0];
    const newMinutes = _date_newTime[1];
    const newTimeDate = new Date();
    newTimeDate.setHours(newHours);
    newTimeDate.setMinutes(newMinutes);
    return newTimeDate
  }
  const trySaveNewTime = () => {
    const newTimeDate = getDateFromPickerTime(_time)
    const newHours = newTimeDate.getHours()
    const newMinutes = newTimeDate.getMinutes()
    if (minTime == null && maxTime == null) {
      saveTime(newTimeDate)
      return;
    }

    if (minTime) {
      if (newHours >= minTime.getHours()) {
        setErrorTime(() => 0)
        saveTime(newTimeDate)
      } else if (newHours == minTime.getHours() && newMinutes > minTime.getMinutes()) {
        setErrorTime(() => 0)
        saveTime(newTimeDate)
      } else {
        setErrorTime(() => -1)
      }
    }
    if (maxTime) {
      if (newHours <= maxTime.getHours()) {
        setErrorTime(() => 0)
        saveTime(newTimeDate)
      } else if (newHours == maxTime.getHours() && newMinutes > maxTime.getMinutes()) {
        setErrorTime(() => 0)
        saveTime(newTimeDate)
      } else {
        setErrorTime(() => 1)
      }
    }

  }

  const setNewTime = (newTime) => {
    _setTime(() => newTime)
  };

  const hidePickTime = () => setShowPickerTime(() => false);
  const showPickTime = () => setShowPickerTime(() => true);

  return (
    <PickerField
      showPopup={showPickerTime}
      btnLabel={
        <>
          {`${preLabel} ${time !== null ? readableTime(time) : ''} `}
        </>
      }
      iconLink={<IoTimeOutline />}
      headerText={''}
      openPopup={showPickTime}
      closePopup={hidePickTime}
    >
      <div className="picker__section">
        <TimeKeeper
          time={_time}
          onChange={(newTime) => {
            setNewTime(newTime.formatted24);
          }}
          doneButton={() =>
            <>
              {errorTime < 0 &&
                <>
                  <FieldError validationError={{ message: t('eventType.afterStart', [readableTime(minTime)]) }} />
                  {handleChangeToMultipleDates &&
                    <Btn
                      btnType={BtnType.corporative}
                      caption={t('eventType.changeToMultipleDates')}
                      iconLeft={IconType.circle}
                      contentAlignment={ContentAlignment.center}
                      onClick={() => { handleChangeToMultipleDates(getDateFromPickerTime(_time)) }}
                    />
                  }
                </>
              }
              {errorTime > 0 && <FieldError validationError={{ message: t('eventType.beforeEnd', [readableTime(maxTime)]) }} />}
              <Btn
                btnType={BtnType.corporative}
                iconLink={<IoSaveOutline />}
                iconLeft={IconType.circle}
                contentAlignment={ContentAlignment.center}
                onClick={() => { trySaveNewTime() }}
                disabled={_time == null}
              />
            </>
          }
          switchToMinuteOnHourSelect
        />
      </div>
    </PickerField>
  );
}
