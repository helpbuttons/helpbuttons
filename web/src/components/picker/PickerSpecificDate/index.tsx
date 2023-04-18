//a variation of picker specific for time

import t from 'i18n';
import { useState } from 'react';
import Calendar from 'react-calendar';
import TimeKeeper from 'react-timekeeper';

import 'react-calendar/dist/Calendar.css';

export default function PickerPeriodDate({defaultDate, closeMenu, onChange }) {
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultDate.getTime());
  return (
    <>
      <section className="repository__section">
        <div className="picker__content">
          
          <div className="picker__section">
            <div className="picker__section__pick">
                <>
                  <header className="picker__header ">
                    {t('calendarOnce.pickday')}
                  </header>
                  <div className="picker__row">
                    <Calendar
                      onChange={(e) => {
                        setDate(e);
                        onChange(e);
                      }}
                      value={date}
                    />
                  </div>
                </>
                <>
                  
                  <header className="picker__header ">
                    {t('calendarOnce.picktime')}
                  </header>

                  <div className="picker__row">
                    <TimeKeeper
                      time={time}
                      onChange={(data) => {
                        date.setHours(data.hour);
                        date.setMinutes(data.minute);
                        setDate(date);
                        onChange(date);
                        setTime(data.formatted24);
                      }}
                    />
                  </div>
                </>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
