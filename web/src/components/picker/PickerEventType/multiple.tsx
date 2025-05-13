import t from 'i18n';
import { mergeDateTime, readableTime } from 'shared/date.utils';
import { TimePick } from './timepick';
import CalendarHb from 'components/calendar';
import { useEffect, useState } from 'react';

export default function PickerEventTypeMultipleForm({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart,
}) {

  const [timeStart, setTimeStart] = useState(eventStart);
  const [timeEnd, setTimeEnd] = useState(eventStart);

  const [dateStart, setDateStart] = useState(eventEnd)
  const [dateEnd, setDateEnd] = useState(eventEnd)

  useEffect(() => {
      setEventStart(mergeDateTime(dateStart, timeStart))
  }, [timeStart, dateStart])
  
  useEffect(() => {
      setEventEnd(mergeDateTime(dateEnd, timeEnd))
  }, [timeEnd, dateEnd])

  
  const setDates = (newDates) => {
    const newStartTimeDate = new Date(newDates[0]);
    setDateStart(() => newStartTimeDate);

    const newEndTimeDate = new Date(newDates[1]);
    setDateEnd(() => newEndTimeDate);
  };
  return (
    <>
      <div className="picker__row">
        <CalendarHb
          onChange={(newDates) => {
            setDates(newDates);
          }}
          value={[dateStart, dateEnd]}
          selectRange
          minDate={new Date()}
        />
      </div>
      {(dateStart && dateEnd) && (
        <div className="picker__row">
          <TimePick
            time={timeStart}
            setTime={(value) => setTimeStart(value)}
          />
          <TimePick
            time={timeEnd}
            setTime={(value) => setTimeEnd(value)}
          />
        </div>
      )}
    </>
  );
}
