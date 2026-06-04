import { mergeDateTime } from 'shared/date.utils';
import { TimeRangePicker } from './timepick';
import CalendarHb from 'components/calendar';
import { useEffect, useState } from 'react';

export default function PickerEventTypeMultipleForm({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart,
}) {

  const [dateStart, setDateStart] = useState(eventStart ? eventStart : null)
  const [dateEnd, setDateEnd] = useState(eventEnd ? eventEnd : null)

  const setTimeStart = (newTime) => {
    setEventStart(() => mergeDateTime(dateStart,newTime))
  }

  const setTimeEnd = (newTime) => {
    setEventEnd(() => mergeDateTime(dateEnd, newTime))
  }

  useEffect(() => {
    if(eventStart){
      setEventStart(() => mergeDateTime(dateStart,eventStart))
    }
  }, [dateStart])
  useEffect(() => {
    if(eventEnd){
      setEventEnd(() => mergeDateTime(dateEnd,eventEnd))
    }
  }, [dateEnd])

  const setDates = (newDates) => {
    const newStartTimeDate = new Date(newDates[0]);
    setDateStart(() => newStartTimeDate);

    const newEndTimeDate = new Date(newDates[1]);
    setDateEnd(() => newEndTimeDate);
  };

  const [defaultValue, setDefaultValue] = useState((dateStart && dateEnd) ? [dateStart, dateEnd] : null )
  
  return (
    <>
      <div className="picker__row">
        <CalendarHb
          onChange={(newDates) => {
            setDates(newDates);
          }}
          selectRange
          minDate={new Date()}
          defaultValue={defaultValue}
        />
      </div>
      {(dateStart && dateEnd) && (
        <TimeRangePicker defaultStart={eventStart} defaultEnd={eventEnd} handleChangeEnd={setTimeEnd} handleChangeStart={setTimeStart}/>
      )}
    </>
  );
}
