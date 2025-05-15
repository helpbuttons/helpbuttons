import t from 'i18n';
import { TimePick } from './timepick';
import { mergeDateTime, readableTime } from 'shared/date.utils';
import CalendarHb from 'components/calendar';
import { useEffect, useState } from 'react';
import { alertService } from 'services/Alert';

export default function PickerEventTypeOnceForm({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart,
  handleChangeToMultipleDates
}) {

  const [timeStart, setTimeStart] = useState(eventStart);
  const [timeEnd, setTimeEnd] = useState(eventStart);

  const [dateStart, setDateStart] = useState(eventEnd)
  const [dateEnd, setDateEnd] = useState(eventEnd)

  useEffect(() => {
    setEventStart(mergeDateTime(dateStart, timeStart))
  }, [timeStart, dateStart])

  useEffect(() => {
    setEventEnd(mergeDateTime(dateStart, timeEnd))
  }, [timeEnd, dateStart])

  return (
    <>
      <div className="picker__row">
        <CalendarHb
          onChange={(newDate) => {
            setDateStart(newDate);
          }}
          value={dateStart}
          minDate={new Date()}
        />
      </div>
      {dateStart && (
        <div className="picker__row">
          <TimePick
            preLabel={t('eventType.from')}
            time={timeStart}
            setTime={(value) => setTimeStart(() => value)}
            maxTime={timeEnd}
          />
          <TimePick
            preLabel={t('eventType.until')}
            time={timeEnd}
            setTime={(value) => setTimeEnd(() => value)}
            minTime={timeStart}
            handleChangeToMultipleDates={(neededTime) => {
              const _newEnd = mergeDateTime(dateStart, neededTime)
              _newEnd.setDate(_newEnd.getDate() + 1)
              handleChangeToMultipleDates(mergeDateTime(dateStart, timeStart), _newEnd)
            }}
          />
        </div>
      )}
    </>
  );
}
