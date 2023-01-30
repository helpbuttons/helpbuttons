//a variation of picker specific for time

import t from 'i18n';
import { useState } from 'react';
import Calendar from 'react-calendar';
import TimeKeeper from 'react-timekeeper';

import 'react-calendar/dist/Calendar.css';
import { getLocale } from 'shared/sys.helper';

export default function PickerPeriodDate({ closeMenu, onChange }) {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('13:12');
  const [showTime, setShowTime] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);

  return (
    <>
      <section className="repository__section">
        <div className="picker__content">
          
          <div className="picker__section">
            <div className="picker__section__pick">
              {showCalendar && (
                <>
                  <header className="picker__header ">
                    {t('picker-specific-date.pickday')}
                  </header>
                  <div className="picker__row">
                    <Calendar
                      onChange={(e) => {
                        setShowTime(true);
                        setShowCalendar(false);
                        setDate(e);
                        onChange(e);
                      }}
                      value={date}
                    />
                  </div>
                </>
              )}
              {showTime && (
                <>
                  <div
                    className="btn"
                    onClick={() => {
                      setShowCalendar(true);
                      setShowTime(false);
                    }}
                  >
                    Change day
                  </div>
                  <header className="picker__header ">
                    {t('picker-specific-date.picktime')}
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
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
