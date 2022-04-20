//a variation of picker specific for time
import moment from "moment";
import { useState } from "react";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";

export default function PickerTime() {
  const [Days, setDays] = useState(moment());
  const [Hour, setHour] = useState("0");
  const [Minutos, setMinutos] = useState("0");
  const [Meridian, setMeridian] = useState("");

  const MinutosInt = parseInt(Minutos);
  const HorasInt = parseInt(Hour);

  const DiaYHora = Days.minutes(MinutosInt).hours(HorasInt);

  const updateMinutos = function (event) {
    setMinutos(event.target.value);
  };

  const updateHoras = function (event) {
    setHour(event.target.value);
  };

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

                  const Lunes = moment().startOf("week").day(1);

                  const LunesQueViene = moment()
                    .day(8)
                    .startOf("week")

                    .day(1);

                  console.log();

                  if (moment() < Lunes) {
                    setDays(Lunes);
                  } else {
                    setDays(LunesQueViene);
                  }
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
                  const Martes = moment().startOf("week").day(2);
                  const MartesQueViene = moment().day(9).startOf("week").day(2);
                  console.log(Martes);

                  if (moment() < Martes) {
                    setDays(Martes);
                  } else {
                    setDays(MartesQueViene);
                  }
                }}
              >
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">Mar</div>
                </div>
              </button>

              <button
                className="btn-circle"
                onClick={() => {
                  const Miercoles = moment().startOf("week").day(3);
                  const MiercolesQueViene = moment()
                    .day(10)
                    .startOf("week")
                    .day(3);
                  console.log(Miercoles);

                  if (moment() < Miercoles) {
                    setDays(Miercoles);
                  } else {
                    setDays(MiercolesQueViene);
                  }
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
                  const Jueves = moment().startOf("week").day(4);
                  const JuevesQueViene = moment()
                    .day(11)
                    .startOf("week")
                    .day(4);
                  console.log(Jueves);

                  if (moment() < Jueves) {
                    setDays(Jueves);
                  } else {
                    setDays(JuevesQueViene);
                  }
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
                  const Viernes = moment().startOf("week").day(5);
                  const ViernesQueViene = moment()
                    .day(12)
                    .startOf("week")
                    .day(5);
                  console.log(Viernes);

                  if (moment() < Viernes) {
                    setDays(Viernes);
                  } else {
                    setDays(ViernesQueViene);
                  }
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
                  const Sabado = moment().startOf("week").day(6);
                  const SabadoQueViene = moment()
                    .day(13)
                    .startOf("week")
                    .day(6);
                  console.log(Sabado);

                  if (moment() < Sabado) {
                    setDays(Sabado);
                  } else {
                    setDays(SabadoQueViene);
                  }
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
                  const Domingo = moment().startOf("week").day(7);
                  const DomingoQueViene = moment()
                    .day(14)
                    .startOf("week")
                    .day(7);
                  console.log(Domingo);

                  if (moment() < Domingo) {
                    setDays(Domingo);
                  } else {
                    setDays(DomingoQueViene);
                  }
                }}
              >
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">Dom</div>
                </div>
              </button>
            </div>

            <div className="picker-time__selected">
              <select
                className="picker-time__dropdown picker-time__dropdown-option"
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

              <span className="picker-time__points">:</span>

              <select
                className="picker-time__dropdown picker-time__dropdown-option"
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
