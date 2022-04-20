import moment from "moment";
import { useState } from "react";

export default function Calendar() {
  const [Days, setDays] = useState(null);

  return (
    <section className="repository__section">
      <div className="picker__content">
        <div className="picker__section">
          <header className="picker__header ">Selecciona día y hora</header>

          <div className="picker__row">
            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Lun</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Mar</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Mie</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Jue</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Vie</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Sab</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Dom</div>
              </div>
            </button>
          </div>

          <div className="picker__row">
            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Lun</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Mar</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Mie</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Jue</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Vie</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Sab</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Dom</div>
              </div>
            </button>
          </div>

          <div className="picker__row">
            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Lun</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Mar</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Mie</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Jue</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Vie</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Sab</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Dom</div>
              </div>
            </button>
          </div>

          <div className="picker__row">
            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Lun</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Mar</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Mie</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Jue</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Vie</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Sab</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Dom</div>
              </div>
            </button>
          </div>

          <div className="picker__row">
            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Lun</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Mar</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Mie</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Jue</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Vie</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Sab</div>
              </div>
            </button>

            <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">Dom</div>
              </div>
            </button>
          </div>

          <div className="picker-time__selected">
            <div className="picker-time__dropdown">
              <div className="picker-time__dropdown-trigger">00</div>
              <div className="picker-time__dropdown-content">
                <div className="picker-time__dropdown-option">00</div>
              </div>
            </div>

            <span className="picker-time__points">:</span>

            <div className="picker-time__dropdown">
              <div className="picker-time__dropdown-trigger">00</div>
              <div className="picker-time__dropdown-content">
                <div className="picker-time__dropdown-option">00</div>
              </div>
            </div>

            <button className="picker-time__dropdown-option">AM</button>
            <button className="picker-time__dropdown-option">PM</button>
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
  );
}
