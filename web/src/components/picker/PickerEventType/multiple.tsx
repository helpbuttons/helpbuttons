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

export default function PickerEventTypeMultipleForm({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart,
}) {
  const loadRangeDates = () => {
    if (eventStart && eventEnd)
    {
        return [eventStart, eventEnd]
    }
    return null;
  }
  const [rangeDates, setRangeDate] = useState(loadRangeDates);

  const [startTime, setStartTime] = useState(
    eventStart
      ? eventStart.getHours() +
          ':' +
          String(eventStart.getMinutes()).padStart(2, '0')
      : '0:00',
  );

  const [endTime, setEndTime] = useState(
    eventEnd
      ? eventEnd.getHours() +
          ':' +
          String(eventEnd.getMinutes()).padStart(2, '0')
      : '0:00',
  );

  useEffect(() => {
    if (rangeDates )
    {
        let datetimeStart = new Date();
        if (rangeDates[0] && !startTime) {
          datetimeStart = new Date(
            rangeDates[0].getFullYear(),
            rangeDates[0].getMonth(),
            rangeDates[0].getDate(),
            0,
            1,
          );
        } else if (rangeDates[0] && startTime) {
          const time = startTime.split(':');
          datetimeStart = new Date(
            rangeDates[0].getFullYear(),
            rangeDates[0].getMonth(),
            rangeDates[0].getDate(),
            time[0],
            time[1],
          );
        }
    
        setEventStart(datetimeStart);
    }
    
  }, [rangeDates, startTime]);


  useEffect(() => {
    if (rangeDates )
    {
        let datetimeStart = new Date();
        if (rangeDates[0] && !startTime) {
          datetimeStart = new Date(
            rangeDates[1].getFullYear(),
            rangeDates[1].getMonth(),
            rangeDates[1].getDate(),
            0,
            1,
          );
        } else if (rangeDates[1] && startTime) {
          const time = endTime.split(':');
          datetimeStart = new Date(
            rangeDates[1].getFullYear(),
            rangeDates[1].getMonth(),
            rangeDates[1].getDate(),
            time[0],
            time[1],
          );
        }
    
        setEventEnd(datetimeStart);
    }
    
  }, [rangeDates, endTime]);
  
  return (
    <>
      <div className="picker__content">
        <div className="picker__section">
          <div className="picker__section__pick">
            <div className="picker__row">
              <Calendar
                onChange={(newDates) => {
                    setRangeDate(newDates)
                }}
                value={rangeDates}
                selectRange
                minDate={new Date()}
              />
            </div>
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
        </div>
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
        btnType={BtnType.iconActions}
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
      )}
    </>
  );
}
