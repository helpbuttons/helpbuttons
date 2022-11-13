//Screen to give access to a network. I can be because is private or because yoou're blocked
import NavHeader from '../../components/nav/NavHeader'

import PopupHeader from '../../components/popup/PopupHeader'


export default function NetworkAccess() {

  return (

    <>

      <div className="popup">

        <PopupHeader />

        <div className="popup__content">

          <form className="popup__section">

            <p className="popup__options-title">
              This Network is private. Do you want to join?
            </p>

          </form>

          <div className="popup__options-h">

            <button className="popup__options-btn">Cancelar</button>
            <button className="popup__options-btn">Aceptar</button>

          </div>

        </div>

      </div>

      

    </>


  );
}
