import moment from "moment";
import { useState, useEffect } from "react";

import buildCalendar from "./build";
import dayStyles from "./styles";

export default function Calendar() {
  const [Days, setDays] = useState(moment());
  const [calendar, setCalendar] = useState([]);
  const [value, setValue] = useState(moment());

  useEffect(() => {
    const day = startDay.clone().subtract(1, "day");
    const a = [];
    while (day.isBefore(endDay, "day")) {
      a.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone())
      );
    }
    setCalendar(buildCalendar(value));
  }, [value]);

  const startDay = value.clone().startOf("month").startOf("week");
  const endDay = value.clone().endOf("month").endOf("week");

  function currMonthName() {
    return value.format("MMMM");
  }

  function currYear() {
    return value.format("YYYY");
  }

  function prevMonth() {
    return value.clone().subtract(1, "month");
  }

  function nextMonth() {
    return value.clone().add(1, "month");
  }

  console.log(value);

  return (
    <div className="calendar picker_content">
      <div className="header">
        <div
          className="previous"
          onClick={() => {
            setValue(prevMonth());
          }}
        >
          {String.fromCharCode(171)}
        </div>
        <div className="current">
          {currMonthName()} {currYear()}
        </div>
        <div
          className="next"
          onClick={() => {
            setValue(nextMonth());
          }}
        >
          {String.fromCharCode(187)}
        </div>
      </div>
      <div className="body">
        <div className="picker_section">
          {calendar.map((week) => (
            <div className="picker_row">
              {week.map((day) => (
                <div className="btn-circle day" onClick={() => setValue(day)}>
                  <div className={dayStyles(day, value)}>
                    {day.format("D").toString()}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
