//the button url itself
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'
import CardButton from '../../components/CardButton'
import CardChat from '../../components/CardChat'
import CardNotification from '../../components/CardNotification'
import NavHeader from '../../components/NavHeader'
import NavBottom from '../../components/NavBottom'


export default function ButtonFile() {

  return (

    <>
        <NavHeader />

        <div class="button-file__center">

          <div class="button-file__card-section">

            <CardButton />

          </div>

          //ACTION SECTION - HERE COME BASIC INTERACTION BUTTONS AND MESSAGE INPUT
          <div class="button-file__action-section">

            <div class="button-file__action-section--field">

              <button class="btn btn--black btn--center">
                Botón ejemplo negro centrado
              </button>

            </div>

            <div class="button-file__action-section--field">

              <form class="chats__new-message" onsubmit="">

                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
                        <CrossIcon />
                      </div>
                    </div>
                  </button>
                  <div class="chats__new-message-message">
                    <input class="form__input chats__new-message-input"></input>
                  </div>
                  <button class="btn-circle">
                    <div class="btn-circle__content">
                      <div class="btn-circle__icon">
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
