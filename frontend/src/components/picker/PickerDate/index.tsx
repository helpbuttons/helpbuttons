import moment from "moment";
import { useState, useEffect } from "react";

import buildCalendar from "./build";
import dayStyles from "./styles";

export default function PickerDate() {
  const [calendar, setCalendar] = useState([]);
  const [value, setValue] = useState(moment());
  const [Hour, setHour] = useState("0");
  const [Minutes, setMinutes] = useState("0");
  const startDay = value.clone().startOf("month").startOf("week");
  const endDay = value.clone().endOf("month").endOf("week");

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
  }, [value, endDay, startDay]);
  
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

  const ParseIntMinutes = parseInt(Minutes);
  const ParseIntHour = parseInt(Hour);

  const CalendarioHoraDia = value.minutes(ParseIntMinutes).hours(ParseIntHour);

  console.log(CalendarioHoraDia);

  const updateHoras = function (event) {
    setHour(event.target.value);
  };

  const updateMinutos = function (event) {
    setMinutes(event.target.value);
  };

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
          {calendar.map((week, id) => (
            <div className="picker_row" key={id}>
              {week.map((day, id) => (
                <div className="btn-circle day" onClick={() => setValue(day)} key={id}>
                  <div className={dayStyles(day, value)}>
                    {day.format("D").toString()}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="picker-date__selected">
        <select
          className="picker-date__dropdown picker-date__dropdown-option"
          onChange={updateHoras}
        >
          <option value="00">00</option>
          <option value="01">01</option>
          <option value="02">02</option>
          <option value="03">03</option>
          <option value="04">04</option>
          <option value="05">05</option>
          <option value="06">06</option>
          <option value="07">07</option>
          <option value="08">08</option>
          <option value="09">09</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
        </select>

        <span className="picker-date__points">:</span>

        <select
          className="picker-date__dropdown picker-date__dropdown-option"
          onChange={updateMinutos}
        >
          <option value="0">00</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
}
