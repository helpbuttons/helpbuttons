import { store } from 'state';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {
  checkIfDateHitsEvent,
} from 'shared/date.utils';
import { Button } from 'shared/entities/button.entity';
import { FindMonthCalendar } from 'state/Button';
import _ from 'lodash';
import dconsole from 'shared/debugger';

export default function CalendarHb(props) {
  const [monthEvents, setMonthEvents] = useState([]);

  const requestMonth = (month, year) => {
    store.emit(
      new FindMonthCalendar(month, year, (monthEvents) => {
        setMonthEvents(() => monthEvents);
      }),
    );
  };

  useEffect(() => {
    const today = new Date();
    store.emit(
      new FindMonthCalendar(
        today.getMonth() + 1,
        today.getFullYear(),
        (monthEvents) => {
          setMonthEvents(() => monthEvents);
        },
      ),
    );
  }, []);

  return (
    <Calendar
      {...props}
      onActiveStartDateChange={({
        action,
        activeStartDate,
        value,
        view,
      }) => {
        dconsole.log('yellow');
        if (view == 'month') {
          const selectedDate = new Date(activeStartDate);

          requestMonth(
            selectedDate.getMonth() + 1,
            selectedDate.getFullYear(),
          );
        }
      }}

      tileClassName={({ date, view }) => {
        let extraClass = '';
        if (props.tileClassName) {
          extraClass = props.tileClassName({ date, view });
        }

        const dayEvents = monthEvents.filter((event: Button) => {
          return checkIfDateHitsEvent(
            event.eventStart,
            event.eventEnd,
            event.eventData,
            date,
          );
        });
        if (dayEvents.length > 0) {
          return extraClass + ' react-calendar_day_has_event';
        }
        return extraClass;
      }}
    />
  );
}
