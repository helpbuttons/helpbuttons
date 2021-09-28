///Header for popups, with cclose option and optional other elements
import CrossIcon from '../../../../public/assets/svg/icons/cross1.tsx'
import { Link } from 'elements/Link';


export default function PopupHeader({children, linkBack, linkFwd}) {
  return (

    <>
      <div className="popup__header">
        <header className="popup__header-content">
          <div className="popup__header-left">
            <Link href={linkBack} className="popup__header-button">
              <div className="btn-circle__icon">
                <CrossIcon />
              </div>
            </Link>
          </div>
          <div className="popup__header-center">
            <h1 className="popup__header-title">
              {children}
            </h1>
          </div>
          <div className="popup__header-right">
            <Link href={linkFwd} className="popup__header-button">
              <div className="btn-circle__icon">
                <CrossIcon />
              </div>
            </Link>
          </div>
        </header>
      </div>

    </>

  );
}
