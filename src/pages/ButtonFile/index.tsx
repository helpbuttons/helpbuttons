//the button url itself
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'
import CardButton from '../../components/CardButton'
import CardNotification from '../../components/CardNotification'
import NavHeader from '../../components/NavHeader'
import NavBottom from '../../components/NavBottom'
import Feed from '../../components/Feed'


export default function ButtonFile() {

  return (

    <>
        <NavHeader />

        <div className="button-file__container">

          <div className="button-file__card-section">

            <CardButton />

          </div>

          //ACTION SECTION - HERE COME BASIC INTERACTION BUTTONS AND MESSAGE INPUT
          <div className="button-file__action-section">

            <div className="button-file__action-section--field">

              <button className="btn btn--black btn--center">
                Botón ejemplo negro centrado
              </button>

            </div>

            <div className="button-file__action-section--field">

              <form className="feeds__new-message" >

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        <CrossIcon />
                      </div>
                    </div>
                  </button>
                  <div className="feeds__new-message-message">
                    <input className="form__input feeds__new-message-input"></input>
                  </div>
                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        <CrossIcon />
                      </div>
                    </div>
                  </button>

              </form>

            </div>

          </div>

        //FEED SECTION - HERE COMME ALL THE NOTIFFICATIONS, MESSAGES and CONVERSATION LINKS FROM EXTERNAL RESOURCES
        <Feed />

      </div>

      <NavBottom />

    </>


  );
}
