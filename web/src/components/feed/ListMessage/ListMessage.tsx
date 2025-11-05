import t from "i18n";
import { IoArrowBack, IoClose, IoFootsteps } from "react-icons/io5";
import ActivityNotificationCard, { NotificationCard } from "../ActivityNotification/ActivityNotificationCard";
import Btn, { BtnCaption, BtnType, ContentAlignment } from "elements/Btn";
import { ButtonType } from "components/button/ButtonType";
import { DropdownField } from "elements/Dropdown/Dropdown";


export function ListMessage() {

  const activity = {
    "id": "7fe7892910594a2588cb7e2f221d82cc3ccb",
    "eventName": "button.message",
    "title": "button.message",

    "read": false,
    "createdAt": "Wed Nov 05 2025 10:53:30 GMT+0000 (Greenwich Mean Time)",
    "message": "I want to tell you that...",
    "button": {"id": "kdsaidysa9", "title": "kdsakdsakjdsa"},
    "sender": {"id": "diusahdsa", "name": "Maria das dores"}
}
  
  return (
    
    <div className="feed__container">
        <div className="feed-section--messages">
          <div className="feed-section__left">
              <div className="feed-section__title">
                Messages & Alerts
              </div>
              <div className="feed-section__filters">
                    <DropdownField options={[{value:"all",name:"all"},{value:"Needs",name:"Needs"}]}/>
              </div>
                <div className="feed-section--activity-content">   
                    <div className="feed-element" >
                        <div className="card-notification">
                          <div className="card-notification__content">
                            <div className="card-notification__avatar">
                              <div className="avatar-medium">
                                <img src="https://dummyimage.com/50/#ccc/fff" alt="Avatar" className="picture__img"></img>
                              </div>
                              {/* <div className="card-notification__icon">
                                <IoClose />
                              </div> */}
                            </div>
                            <div className="card-notification__text">
                              <div className="card-notification__header">
                                <div className="card-notification__info">
                                <div className="">hace 2 días</div>-<div className=""> Type</div>
                                </div>
        
                              </div>
                              <h2 className="card-notification__title">
                                Jorge
                              </h2>
                              <div className="card-notification__paragraph">
                                Lorem ipsum es el texto que se usa en diseño gráfico en demostraciones Lorem ipsum es el texto que se usa en diseño gráfico en demostraciones...
                              </div>
                            </div>
                          </div>
                        </div> 
                      </div>

                    {/* <div className="feed__empty-message">
                      <div className="feed__empty-message--prev">
                        {t('activities.noactivity', ['activities'])}
                      </div>
                      <Btn
                        caption={t('explore.createEmpty')}
                        contentAlignment={ContentAlignment.center}
                      />
                    </div> */}
            
                    <div className="feed__empty-message">
                      <div className="feed__empty-message--prev">
                        {t('feed.noMoreNotifications')}
                      </div>
                    </div>
                </div>
            </div>

            <div className="feed-section__center">
              <div className="popup__header">
                <header className="popup__header-content">
                  <div className="popup__header-left">
                    <button className="popup__header-button">
                      <div className="btn-circle__icon">
                        <IoClose />
                      </div>
                    </button>
                  </div>
                  <div className="popup__header-center">
                    <h1 className="popup__header-title">
                      Username
                    </h1>
                  </div>
                  <div className="popup__header-right">
                    <button className="popup__header-button">
                      <div className="btn-circle__icon">
                        <IoClose />
                      </div>
                    </button>
                  </div>
                </header>
              </div>
              <div className="feed-section__center__messages">
                     <div className="message__hour">
                      00:00
                    </div>
                <div className="message message--me">
                    <div className="message__content">
                      message
                    </div>
                  </div>
                <div className="message message--you">
                  <div className="message__header">
                      <div className="message__avatar">
                        <img src="https://dummyimage.com/30/#ccc/fff" alt="Avatar" className="avatar picture__img"></img>
                      </div>

                    <div className="message__user-name-container">
                      <p className="message__user-name">Username</p>
                    </div>
                  </div>
                  <div className="message__content">
                    message
                  </div>
                </div>
              </div>
              <form className="feeds__new-message" >

              <button className="btn-circle">
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">
                    <IoClose />
                  </div>
                </div>
              </button>
              <div className="feeds__new-message-message">
                <input className="form__input feeds__new-message-input"></input>
              </div>
              <button className="btn-circle">
                <div className="btn-circle__content">
                  <div className="btn-circle__icon">
                    <IoClose />
                  </div>
                </div>
              </button>

          </form>


            </div>

            <div className="feed-section__right">
              derecha
            </div>
        </div>

    </div>

  );
}
