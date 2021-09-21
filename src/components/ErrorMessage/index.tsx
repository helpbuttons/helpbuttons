///error small popup
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'

export default function ErrorMessage() {
  return (

    <div className="error-message">

      <div className="error-message__icon">
        <CrossIcon />
      </div>
      <div className="">
        <p className="error-message__top-text">Error</p>
        <h4 className="error-message__title">
          Titulo error
        </h4>
        <p className="error-message__subtitle">
          Error mensaje
        </p>
      </div>

    </div>
  );
}
