import t from 'i18n';
import { TimePickInput } from './timepick';
import CalendarHb from 'components/calendar';
import { mergeDateTime } from 'shared/date.utils';
import { useState } from 'react';

export default function PickerEventTypeOnceForm({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart
}) {
  const [dateStart, setDateStart] = useState(eventStart ? eventStart : null)

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
        <div className="picker__row">
          <span><span>{t('eventType.from')}</span><TimePickInput defaultDateTime={eventStart}
            handleChange={(value) => setTimeStart(value)}/></span>
          <span><span>{t('eventType.until')}</span><TimePickInput defaultDateTime={eventStart}
            handleChange={(value) => setTimeEnd(value)}/></span>
        </div>
      )}
    </>
  );
}
