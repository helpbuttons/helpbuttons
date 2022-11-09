//Profile Card with the the info displayed by the user in Profile page. It shows different options depending if it's other user profile or your profile when logged.
import { IoClose } from "react-icons/io5";

export default function Directory() {
  return (
    <>
      <div className="directory__container">

          <div className="directory__content">

              <div className="directory__section">

                <div className="directory__sub-section">

                </div>

              </div>


              <div className="directory__section">

                <div className="btn-with-icon">

                  <div className="btn-with-icon__icon">
                    <IoClose />
                  </div>
                  <span className="btn-with-icon__text">
                    Tema interior de índice
                  </span>

                </div>

                <div className="btn-with-icon">

                  <div className="btn-with-icon__icon">
                    <IoClose />
                  </div>
                  <span className="btn-with-icon__text">
                    Tema interior de índice
                  </span>

                </div>

              </div>

          </div>

      </div>

    </>
  );
}
