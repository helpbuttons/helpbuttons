import CrossIcon from '../../public/assets/svg/icons/cross1'

export default function Spinner() {
    return (
      <div className="spinner-overlay">
        <figure className="btn-circle">
          <div className="loading-overlay__loading-icon spinner">
            <CrossIcon />
          </div>
        </figure>
      </div>
    );
}
