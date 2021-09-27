///Header for popups, with cclose option and optional other elements
import CrossIcon from '../../../../public/assets/svg/icons/cross1.tsx'


export default function PopupHeader() {
  return (

    <>
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
              Username
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

    </>

  );
}
