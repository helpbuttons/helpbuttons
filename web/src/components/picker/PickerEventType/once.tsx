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
import t from 'i18n';
import { Picker } from '../Picker';

export default function PickerEventTypeOnceForm({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart,
}) {
  const [startDate, setStartDate] = useState(
    eventStart ? eventStart : new Date(),
  );

  const [startTime, setStartTime] = useState(
    eventStart
      ? eventStart.getHours() +
          ':' +
          String(eventStart.getMinutes()).padStart(2, '0')
      : '0:01',
  );

  const [endTime, setEndTime] = useState(
    eventEnd
      ? eventEnd.getHours() +
          ':' +
          String(eventEnd.getMinutes()).padStart(2, '0')
      : '23:59',
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
      
            <div className="picker__row">
              <Calendar
                onChange={(newDate) => {
                  setStartDate((prevDate) => newDate);
                }}
                value={startDate}
                minDate={new Date()}
              />
            </div>
            <div className="picker__row">
              <TimePick
                time={startTime}
                setTime={setStartTime}
                label={t('eventType.from') + startTime}
              />
              <TimePick
                time={endTime}
                setTime={setEndTime}
                label={t('eventType.until') + endTime}
              />
            </div>

    </>
  );
}

function TimePick({ time, setTime, label }) {
  const [showFromTime, setShowFromTime] = useState(false);
  return (
    <>
      <Btn
        caption={label}
        btnType={BtnType.splitIcon}
        iconLink={<IoTimeOutline />}
        iconLeft={IconType.circle}
        contentAlignment={ContentAlignment.center}
        onClick={() =>
          setShowFromTime((show) => {
            return !show;
          })
        }
      />
      {showFromTime && (

        <Picker
        closeAction={() => {setShowFromTime(false)}}
        headerText={t('eventType.headerText')}
        >
         <div className="picker__row">
            <TimeKeeper
              time={time}
              onChange={(newTime) => {
                setTime(() => {
                  return newTime.formatted24;
                });
              }}
              onDoneClick={() => {
                  setShowFromTime(() => false);
              }}
              switchToMinuteOnHourSelect
            />
          </div>
        </Picker>
      )}
    </>
  );
}
