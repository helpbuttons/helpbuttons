import { IoClose } from "react-icons/io5";

export default function Spinner() {
    return (
      <div className="spinner-overlay">
        <figure className="btn-circle">
          <div className="loading-overlay__loading-icon spinner">
            <IoClose />
          </div>
        </figure>
      </div>
    );
}
