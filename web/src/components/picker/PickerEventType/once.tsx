import t from 'i18n';
import { TimePick } from './timepick';
import { readableTime } from 'shared/date.utils';
import CalendarHb from 'components/calendar';

export default function PickerEventTypeOnceForm({
  eventStart,
  eventEnd,
  setEventEnd,
  setEventStart,
}) {

  const setStartDate = (newDate) => {
    const newStartTimeDate = new Date(newDate);
    newStartTimeDate.setHours(
      eventStart ? eventStart.getHours() : '0',
    );
    newStartTimeDate.setMinutes(
      eventStart ? eventStart.getMinutes() : '01',
    );

    setEventStart(newStartTimeDate);

    const newEndTimeDate = new Date(newDate);
    newEndTimeDate.setHours(
      eventEnd ? eventEnd.getHours() : '23',
    );
    newEndTimeDate.setMinutes(
      eventEnd ? eventEnd.getMinutes() : '59',
    );

    setEventEnd(newEndTimeDate)
  };

  return (
    <>
      <div className="picker__row">
        <CalendarHb
          onChange={(newDate) => {
            setStartDate(newDate);
          }}
          value={eventStart}
          minDate={new Date()}
        />
      </div>
      <div className="picker__row">
        {eventStart && (
          <>
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
          </>
        )}
      </div>
    </>
  );
}
