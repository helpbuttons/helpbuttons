//the button url itself
import { IoPaperPlaneOutline } from "react-icons/io5";
import { IoAddOutline } from "react-icons/io5";

import CardButton from 'components/button/CardButton'
import CardNotification from 'components/feed/CardNotification'
import NavHeader from 'components/nav/NavHeader'

import Feed from 'layouts/Feed'


export default function ButtonFile() {

  return (

    <>
        <NavHeader />

        <div className="button-file__container">


            <CardButton />


          {/* ACTION SECTION - HERE COME BASIC INTERACTION BUTTONS AND MESSAGE INPUT */}
          <div className="button-file__action-section">

            <div className="button-file__action-section--field">

              <form className="feeds__new-message" >

                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        <IoAddOutline />
                      </div>
                    </div>
                  </button>
                  <div className="feeds__new-message-message">
                    <input className="form__input feeds__new-message-input"></input>
                  </div>
                  <button className="btn-circle">
                    <div className="btn-circle__content">
                      <div className="btn-circle__icon">
                        <IoPaperPlaneOutline />
                      </div>
                    </div>
                  </button>

              </form>

            </div>

          </div>

        {/* FEED SECTION - HERE COMME ALL THE NOTIFFICATIONS, MESSAGES and CONVERSATION LINKS FROM EXTERNAL RESOURCES */}
        <Feed />

      </div>



    </>


  );
}
