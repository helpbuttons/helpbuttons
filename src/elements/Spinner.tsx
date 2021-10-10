export default { Spinner };

function Spinner() {
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
