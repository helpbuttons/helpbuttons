//a variation of picker specific for time
import moment from "moment";
import { useState } from "react";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";

export default function PickerTime() {
  const [Days, setDays] = useState("");
  const [Hour, setHour] = useState("");
  const [Meridian, setMeridian] = useState("");
  const [value, onChange] = useState(new Date());

  console.log(Days + " " + Hour + " " + Meridian);

  return (
    <>
      <section className="repository__section">
        <div className="picker__content">
          <div className="picker__section">
            <header className="picker__header ">
              Selecciona días de la semana y hora
            </header>
            <div className="picker__row">
              <button
                className="btn-circle"
                onClick={() => {
                  moment().locale("es");
                  const Lunes = moment().day(1).format("dddd Do MMMM YYYY");
                  setDays(Lunes);
                }}
              >
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">Lun</div>
                </div>
              </button>

              <button
                className="btn-circle"
                onClick={() => {
                  moment().locale("es");
                  const Martes = moment().day(2).format("dddd Do MMMM YYYY");
                  setDays(Martes);
                }}
              >
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">Mar</div>
                </div>
              </button>

              <button
                className="btn-circle"
                onClick={() => {
                  const Miercoles = moment().day(3).format("dddd Do MMMM YYYY");
                  setDays(Miercoles);
                }}
              >
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">Mier</div>
                </div>
              </button>

              <button
                className="btn-circle"
                onClick={() => {
                  moment().locale("es");
                  const Jueves = moment().day(4).format("dddd Do MMMM YYYY");
                  setDays(Jueves);
                }}
              >
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">Jue</div>
                </div>
              </button>

              <button
                className="btn-circle"
                onClick={() => {
                  moment().locale("es");
                  const Viernes = moment().day(5).format("dddd Do MMMM YYYY");
                  setDays(Viernes);
                }}
              >
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">Vie</div>
                </div>
              </button>

              <button
                className="btn-circle"
                onClick={() => {
                  moment().locale("es");
                  const Sabado = moment().day(6).format("dddd Do MMMM YYYY");
                  setDays(Sabado);
                }}
              >
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">Sab</div>
                </div>
              </button>

              <button
                className="btn-circle"
                onClick={() => {
                  moment().locale("es");
                  const Domingo = moment().day(7).format("dddd Do MMMM YYYY");
                  setDays(Domingo);
                }}
              >
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">Dom</div>
                </div>
              </button>
            </div>

            <div className="picker-time__selected">
              <select className="picker-time__dropdown picker-time__dropdown-option">
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

              <span className="picker-time__points">:</span>

              <select className="picker-time__dropdown picker-time__dropdown-option">
                <option value="00">00</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
                <option value="60">60</option>
              </select>

              <button
                className="picker-time__dropdown-option"
                onClick={() => {
                  setMeridian("AM");
                }}
              >
                AM
              </button>
              <button
                className="picker-time__dropdown-option"
                onClick={() => {
                  setMeridian("PM");
                }}
              >
                PM
              </button>
            </div>
          </div>
          <div className="picker__options-v">
            <button
              className="picker__option-btn--center"
              type="button"
              name="button"
            >
              <div className="picker__option-btn--txt">Aceptar</div>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
