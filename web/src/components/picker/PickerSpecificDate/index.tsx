//a variation of picker specific for time

import t from 'i18n';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import TimeKeeper from 'react-timekeeper';

import 'react-calendar/dist/Calendar.css';
import { IoTimeOutline } from 'react-icons/io5';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';

export default function PickerSpecificDate({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart,
  closeMenu,
  onChange,
}) {
  const [startDate, setStartDate] = useState(
    eventStart ? eventStart : new Date(),
  );

  const [startTime, setStartTime] = useState(
    eventStart
      ? eventStart.getHours() + ':' + eventStart.getMinutes()
      : '0:00',
  );

  const [endTime, setEndTime] = useState(
    eventEnd
    ? eventEnd.getHours() + ':' + eventEnd.getMinutes()
    : '0:00'
    );

  useEffect(() => {
    let datetimeStart = new Date();
    if (startDate && !startTime) {
      datetimeStart = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        0,
        1,
      );
    } else if (startDate && startTime) {
      const time = startTime.split(':');
      datetimeStart = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        time[0],
        time[1],
      );
    }

    setEventStart(datetimeStart);
  }, [startDate, startTime]);

  useEffect(() => {
    let datetimeStart = new Date();
    if (startDate && !endTime) {
      datetimeStart = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        0,
        1,
      );
    } else if (startDate && endTime) {
      const time = endTime.split(':');
      datetimeStart = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        time[0],
        time[1],
      );
    }

    setEventEnd(datetimeStart);
  }, [startDate, endTime]);
  return (
    <>
      <div className="picker__content">
        <div className="picker__section">
          <div className="picker__section__pick">
            <div className="picker__row">
              <Calendar
                onChange={(newDate) => {
                  setStartDate((prevDate) => newDate);
                }}
                value={startDate}
              />
            </div>
            <TimePick time={startTime} setTime={setStartTime} label={'From...' + startTime}/>
            <TimePick time={endTime} setTime={setEndTime} label={'Until... ' + endTime}/>

          </div>
        </div>
      </div>
    </>
  );
}


function TimePick({time, setTime, label}) {
  const [showFromTime, setShowFromTime] = useState(false);

  return (
    <>
      <Btn
        caption={label}
        btnType={BtnType.iconActions}
        iconLink={<IoTimeOutline />}
        iconLeft={IconType.circle}
        contentAlignment={ContentAlignment.center}
        onClick={() => setShowFromTime((show) => !show)}
      />
      {showFromTime && (
        <div className="picker__row">
          <TimeKeeper
            time={time}
            onChange={(newTime) => {
              setTime(() => {
                return newTime.formatted24;
              });
            }}
            onDoneClick={() => setShowFromTime(() => false)}
            switchToMinuteOnHourSelect
          />
        </div>
      )}
    </>
  );
}