import { TimeRangePicker } from './timepick';
import CalendarHb from 'components/calendar';
import { mergeDateTime } from 'shared/date.utils';
import { useEffect, useState } from 'react';

export default function PickerEventTypeOnceForm({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart
}) {
  const [dateStart, setDateStart] = useState(eventStart ? eventStart : null)

  useEffect(() => {
    if(eventStart){
      setEventStart(() => mergeDateTime(dateStart,eventStart))
    }
    if(eventEnd){
      setEventEnd(() => mergeDateTime(dateStart,eventEnd))
    }
  }, [dateStart])
  
  const setTimeStart = (newTime) => {
    setEventStart(() => mergeDateTime(dateStart,newTime))
  }

  const setTimeEnd = (newTime) => {
    setEventEnd(() => mergeDateTime(dateStart, newTime))
  }
  
  return (
    
    <>
      <div className="picker__row">
        <CalendarHb
          onChange={(newDate) => {
            setDateStart(() => newDate);
          }}
          value={dateStart}
          minDate={new Date()}
        />
      </div>
      {(dateStart) && (
        <TimeRangePicker defaultStart={eventStart} defaultEnd={eventEnd} handleChangeEnd={setTimeEnd} handleChangeStart={setTimeStart}/>
      )}
    </>
  );
}
