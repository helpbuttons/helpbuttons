import t from 'i18n';
import { readableTime } from 'shared/date.utils';
import { TimePick } from './timepick';
import CalendarHb from 'components/calendar';

export default function PickerEventTypeMultipleForm({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart,
}) {

  const setDates = (newDates) => {
    const newStartTimeDate = new Date(newDates[0]);
    newStartTimeDate.setHours(
      eventStart ? eventStart.getHours() : '0',
    );
    newStartTimeDate.setMinutes(
      eventStart ? eventStart.getMinutes() : '01',
    );

    setEventStart(newStartTimeDate);

    const newEndTimeDate = new Date(newDates[1]);
    newEndTimeDate.setHours(eventEnd ? eventEnd.getHours() : '23');
    newEndTimeDate.setMinutes(
      eventEnd ? eventEnd.getMinutes() : '59',
    );

    setEventEnd(newEndTimeDate);
  };
  return (
    <>
      <div className="picker__row">
        <CalendarHb
          onChange={(newDates) => {
            setDates(newDates);
          }}
          value={[eventStart, eventEnd]}
          selectRange
          minDate={new Date()}
        />
      </div>
      {(eventStart && eventEnd) && (
        <div className="picker__row">
          <TimePick
            dateTime={eventStart}
            setDateTime={(value) => setEventStart(value)}
            label={t('eventType.from') + readableTime(eventStart)}
          />
          <TimePick
            dateTime={eventEnd}
            setDateTime={(value) => setEventEnd(value)}
            label={t('eventType.until') + readableTime(eventEnd)}
          />
        </div>
      )}
    </>
  );
}
