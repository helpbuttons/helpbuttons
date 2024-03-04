import { DropdownField } from 'elements/Dropdown/Dropdown';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { RRule } from 'rrule';
import {
  readableDayOfLongWeek,
  readableMonth,
  readableShortDate,
  readableTime,
} from 'shared/date.utils';
import t from 'i18n';
import { TimePick } from './timepick';
import WeekDayPicker from './weekDayPicker';

const convertWeekDay = (date) => {
  const weekday = date.getDay() - 1;
  return weekday > -1 ? weekday : 6;
};

export default function PickerEventTypeRecurrentForm({
  rrule,
  setRrule,
}) {
  const [startDate, setStartDate] = useState<Date>(
    rrule?.dtstart ? rrule.dtstart : null,
  );
  const [endDate, setEndDate] = useState<Date>(
    rrule?.until ? rrule.until : null,
  );

  const [periodicity, setPeriodicity] = useState(
    rrule?.freq ? rrule.freq : RRule.WEEKLY,
  );
  const [recrule, setRecrule] = useState<RRule>(
    rrule ? new RRule(rrule) : null,
  );

  useEffect(() => {
    if (startDate && endDate) {
      switch (parseInt(periodicity)) {
        case RRule.WEEKLY: {
          const newRules = {
            freq: RRule.WEEKLY,
            interval: 1,
            byweekday: rrule?.byweekday ? rrule.byweekday : [convertWeekDay(startDate)],
            dtstart: startDate,
            until: endDate,
          };
          setRrule(JSON.parse(JSON.stringify(newRules)));
          break;
        }
        case RRule.MONTHLY: {
          const newRules = {
            freq: RRule.MONTHLY,
            interval: 1,
            dtstart: startDate,
            until: endDate,
          };
          setRrule(JSON.parse(JSON.stringify(newRules)));
          break;
        }
      }
    }
  }, [endDate, startDate, periodicity]);

  useEffect(() => {
    if(rrule)
    {
      console.log(rrule)
      setRecrule(() => new RRule(rrule));
    }
  }, [rrule])

  const weekOfMonth = function (date) {
    var month = date.getMonth(),
      year = date.getFullYear(),
      firstWeekday = new Date(year, month, 1).getDay(),
      lastDateOfMonth = new Date(year, month + 1, 0).getDate(),
      offsetDate = date.getDate() + firstWeekday - 1,
      index = 1, // start index at 0 or 1, your choice
      weeksInMonth =
        index + Math.ceil((lastDateOfMonth + firstWeekday - 7) / 7),
      week = index + Math.floor(offsetDate / 7);
    return week === weeksInMonth ? index + 5 : week;
  };

  return (
    <>
      <div className="picker-date__recurrent">
        <DropdownField
          options={[
            {
              value: RRule.WEEKLY,
              name: 'Every week',
            },
            {
              value: RRule.MONTHLY,
              name: 'Every month',
            },
          ]}
          onChange={(value) => {
            setPeriodicity(() => value);
          }}
          defaultSelected={periodicity}
        />
        {periodicity == RRule.WEEKLY && (
          <>
            <Calendar
              onChange={(newDates) => {
                setStartDate(() => newDates[0]);
                setEndDate(() => newDates[1]);
              }}
              value={[startDate, endDate]}
              selectRange
              minDate={new Date()}
              tileClassName={({ date, view }) => {
                if (
                  recrule
                    ?.all()
                    .find(
                      (dateRule) =>
                        date.toDateString() ==
                        dateRule.toDateString(),
                    )
                ) {
                  return 'react-calendar__selected';
                }
              }}
            />
            {(startDate || endDate) && (
              <WeekDayPicker
                selectedWeekDays={
                  rrule?.byweekday ? rrule.byweekday : []
                }
                setSelectedWeekDays={(weekDays) => {
                  setRrule({ ...rrule, byweekday: weekDays });
                }}
              />
            )}
          </>
        )}
        {periodicity == RRule.MONTHLY && (
          <>
            <div className="picker__row">
              <Calendar
                onChange={(newDates) => {
                  setStartDate(() => newDates[0]);
                  setEndDate(() => newDates[1]);
                }}
                value={[startDate, endDate]}
                selectRange
                minDate={new Date()}
              />
            </div>
          </>
        )}
        {startDate && endDate && (
          <>
            <TimePick
              dateTime={startDate}
              setDateTime={(value) => setStartDate(value)}
              label={t('eventType.from') + readableTime(startDate)}
            />
            <TimePick
              dateTime={endDate}
              setDateTime={(value) => setEndDate(value)}
              label={t('eventType.until') + readableTime(endDate)}
            />
          </>
        )}
        <div>{recrule && <>{recurrentToText(rrule)}</>}</div>
      </div>
    </>
  );
}

function WeekDay(dayOfWeek) {
  const current = new Date()
  var first = current.getDate() - current.getDay() + (dayOfWeek+1);
  return readableDayOfLongWeek(new Date(current.setDate(first++)))
}

export const recurrentToText = (rrule) => {
  if (!rrule) {
    return '';
  }
  switch (parseInt(rrule.freq)) {
    case RRule.WEEKLY: {
      return (
        <>
          {t('dates.each')} {rrule.byweekday.map(weekday => WeekDay(weekday)).toString()}  {t('dates.from')}{' '}
          {readableShortDate(rrule.dtstart)} {t('dates.until')}{' '}
          {readableShortDate(rrule.until)} {t('dates.at')} {readableTime(rrule.dtstart)} {t('dates.until')} {readableTime(rrule.until)}
        </>
      );
    }
    case RRule.MONTHLY: {
      const startDate = new Date(rrule.dtstart);
      const endDate = new Date(rrule.until);
      const until =
        endDate.getMonth() != startDate.getMonth() ? (
          <>
            {t('dates.eachMonthFrom')} {readableMonth(startDate)}{' '}
            {t('dates.until')} {readableMonth(endDate)} 
          </>
        ) : (
          <>
            {t('dates.of')} {readableMonth(startDate)}
          </>
        );
      return (
        <>
          {t('dates.the')} {startDate.getDate()}  {until} {t('dates.at')} {readableTime(startDate)} {t('dates.until')} {readableTime(endDate)}
        </>
      );
    }
  }
};



export const loadRrules = (obj) => {
  if(!obj)
  {
    return null
  }
  if(!obj.freq)
  {
    obj = JSON.parse(obj)
  }
  switch(parseInt(obj.freq))
  {
    case RRule.WEEKLY: {
      return {
        freq: RRule.WEEKLY,
        interval: obj.interval,
        byweekday: obj.byweekday,
        dtstart: new Date(obj.dtstart),
        until: new Date(obj.until)
      }
    }
    case RRule.MONTHLY: {
      return {
        freq: RRule.MONTHLY,
        dtstart: new Date(obj.dtstart),
        until: new Date(obj.until)
      }
    }
  }
}