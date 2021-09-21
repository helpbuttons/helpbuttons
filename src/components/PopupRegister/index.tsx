//Form component with the main fields for register in the platform
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'

export default function PopupRegister() {
  return (

  <div className="popup">
    <div className="popup__header">
      <header className="popup__header-content">
        <div className="popup__header-left">
          <button className="popup__header-button">
            <div className="btn-circle__icon">
              <CrossIcon />
            </div>
          </button>
        </div>
        <div className="popup__header-center">
          <h1 className="popup__header-title">
            Register
          </h1>
        </div>
        <div className="popup__header-right">
          <button className="popup__header-button">
            <div className="btn-circle__icon">
              <CrossIcon />
            </div>
          </button>
        </div>
      </header>
    </div>

    <div className="popup__content">

      <div className="popup__img">
        <img src="https://dummyimage.com/550x200/#ccc/fff" alt="Register_img" className=""></img>
      </div>

      <form className="popup__section" >

        <div className="form-field">
          <input type="text" className="form__input" placeholder="Escribe tu mail para participar"></input>
        </div>

        <button className="btn-with-icon button-with-icon--offer">
          <div className="btn-filter__icon">
            <CrossIcon />
          </div>
          <div className="btn-with-icon__text">
            ENTRAR
          </div>
        </button>

      </form>

      <div className="popup__options-v">

        <button className="popup__options-btn">Tengo cuenta</button>

      </div>

    </div>

  </div>

  );
}
