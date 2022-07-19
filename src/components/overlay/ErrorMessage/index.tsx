///error small popup
import { IoClose } from "react-icons/io5";

export default function ErrorMessage() {
  return (

    <div className="card-alert">

      <div className="card-alert__icon">
        <IoClose />
      </div>
      <div className="">
        <p className="card-alert__top-text">Error</p>
        <h4 className="card-alert__title">
          Titulo error
        </h4>
        <p className="card-alert__subtitle">
          Error mensaje
        </p>
      </div>

    </div>
  );
}
