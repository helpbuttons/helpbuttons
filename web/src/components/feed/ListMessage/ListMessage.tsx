import t from "i18n";
import { IoClose, IoSend } from "react-icons/io5";
import { DropdownField } from "elements/Dropdown/Dropdown";
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { readableTimeLeftToDate } from "shared/date.utils";
import { useButtonTypes } from "shared/buttonTypes";
import { ActivityEventName } from "shared/types/activity.list";
import { useEffect, useRef, useState } from "react";
import _ from 'lodash';
import { FindButtonNotifications, SendNewMessage } from "state/Activity";
import { store } from "state";
import { FindButton } from "state/Explore";
import { SetMainPopupCurrentButton } from "state/HomeInfo";
import FieldText from "elements/Fields/FieldText";


const updateFilters = (buttonTypes, activities) => {
  const [filterButtons, setFilterButtons] = useState([{ value: "all", name: "all" }])

  useEffect(() => {
    if (buttonTypes?.length > 0) {
      const allTypes = _.uniq(activities.map((activity) => activity.buttonType)).filter((t) => t ? true : false)
      console.log(allTypes)
      const fullTypes = allTypes.map((_btnType) => buttonTypes.find((btnType) => { return btnType.name == _btnType }))
      const newTypes = fullTypes.map((btnType) => { return { name: btnType?.caption ? btnType.caption : 'unknown', value: btnType.name } });
      setFilterButtons(() => [{ value: "all", name: "all" }, ...newTypes])
    }
  }, [buttonTypes])
  return filterButtons;
}

export function ListMessage({activities}) {

  const buttonTypes = useButtonTypes()
  // K pasa se es creado un nuevo post... ? Como se va a mirar? no es un mensaje...
  const allActivities = [{
    "id": "7fe7892910594a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.Message,
    "read": true,
    "createdAt": new Date("Wed Nov 05 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": "Hola tienes todavía el kilo de alimentos que ofrecías",
    "footer": "Laranjas al kilo - Calle Juan, Madrid",
    "from": "Manuel",
    "title": "Manuel",
    "image": "/files/get/e44e58be7ffc4325a2cbb6f939f736c99f82.jpeg", 
    // if is owner of the button, show the user image, if not show the button image
    "buttonType": "offer",
    "type": "Message" // Comment
  },
  {
    "id": "7fe7892910594a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.Message,
    "read": false,
    "createdAt": new Date("Wed Nov 05 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": "Hola tienes todavía el kilo de alimentos que ofrecías",
    "footer": "Laranjas al kilo - Calle Juan, Madrid",
    "from": "",
    "title": "Manuel",
    "image": "/files/get/e44e58be7ffc4325a2cbb6f939f736c99f82.jpeg",
    "buttonType": "offer",
    "type": "Message" // Comment
  },
  {
    "id": "7fe7892910594a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.Message,
    "read": false,
    "createdAt": new Date("Wed Nov 05 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": "Buscamos un fornecedor de kiwis",
    "premessage": "Manuel: ",
    "footer": "",
    "from": "Manuel",
    "title": "Community & support",
    "image": "/files/get/e44e58be7ffc4325a2cbb6f939f736c99f82.jpeg",
    "buttonType": "offer",
    "type": "Message" // Comment
  },
  {
    "id": "7fe7892910594a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.Message,
    "read": false,
    "createdAt": new Date("Wed Nov 05 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "premessage": "Manuel: ",
    "message": "Este Luis es muy peligroso pa la red",
    "footer": "",
    "from": "Manuel",
    "title": "Coordinators",
    "image": "/files/get/e44e58be7ffc4325a2cbb6f939f736c99f82.jpeg",
    "buttonType": "offer",
    "type": "Message" // Comment
  },
  {
    "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.DeleteButton,
    "read": true,
    "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": t("_helpbutton_ was deleted"),
    "footer": "Lemons al kilo - Calle Juan, Madrid",
    "from": "",
    "image": "",
    "buttonType": "need",
    "type": "Notice",
    "title": "Manuel"
  },
  // we dont publish new button!
  // {
  //   "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
  //   "eventName": ActivityEventName.NewButton,
  //   "read": true,
  //   "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
  //   "message": "new button created",
  //   "subtitle": "",
  //   "from": "",
  //   "image": "",
  //   "buttonType": "need",
  //   "type": ""
  // },
  {
    "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.NewPost,
    "read": true,
    "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": "new post created 'Tenemos mas manzanas disponibles'",
    "footer": "Venda de vegetales - Calle del Jose, Barcelona", // title of buttton
    "from": "",
    "title": "Manuel",
    "image": "",
    "buttonType": "need",
    "type": "Notice",
    "link": "/ShowPost?id=82719321"
  },
  {
    "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.NewPostComment,
    "read": true,
    "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": "comented on your button 'Esta oferta no es cierta, esta persona no es de fiar....'",
    "footer": "Animal perdido en la calle - Madrid",
    "title": "Maria", // the person that wrote the comment
    "image": "",
    "buttonType": "need",
    "type": "Notice",
    "link": "/LinkToOpenPostComment"
  },
  {
    "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.NewFollowingButton,
    "read": true,
    "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": t("Followed your _helpbutton_"),
    "title": "Margarida",
    "from": "",
    "image": "",
    "buttonType": "need",
    "type": "Notice",
    "footer": "Animal perdido en la calle - Madrid",
  },
  {
    "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.NewFollowingButton,
    "read": true,
    "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": t("You started following"),
    "title": "",
    "from": "",
    "image": "",
    "buttonType": "need",
    "type": "Notice",
    "footer": "Animal perdido en la calle - Madrid",
  },
  // {
  //   "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
  //   "eventName": ActivityEventName.ExpiredButton,
  //   "read": true,
  //   "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
  //   "message": "new button created",
  //   "subtitle": "",
  //   "from": "",
  //   "image": "",
  //   "buttonType": "need",
  //   "type": ""
  // }
  ]

  const filterButtons = updateFilters(buttonTypes, allActivities)

  // const [buttonPage, setButtonPage] = useState(0)
  const [buttonActivities, setButtonActivities] = useState(allActivities)
  const [buttonConsumerId, setButtonConsumerId] = useState(null)
  const [selectedButton, setSelectedButton] = useState(null)
  // const [fromId, setFromId] = usetState(null)
  const fetchButtonFromId = (buttonId, consumerId) => {
    // TODO: buttonPage auto load on scroll?!
    setButtonConsumerId(() => null)
    setSelectedButton(() => null)
    store.emit(new FindButtonNotifications(buttonId, consumerId, 0, 
      (_activites) => {
        console.log(_activites)
        setButtonConsumerId(() => consumerId)
        setButtonActivities(() => _activites)
      }
    ))
    store.emit(new FindButton(buttonId, (button) => {
      setSelectedButton(() => button)
      // setFromId(() => fromId)
    }))
  }

  const sendNewMessage = (message, consumerId) => {
    store.emit(new SendNewMessage(message, selectedButton.id, buttonConsumerId, () => console.log('message sent!')))
  }
  
  const closeConversation = () => {
    setButtonActivities(() => [])
    setSelectedButton(() => null)
    setButtonConsumerId(() => null)
  }
  return (

    <div className="feed__container">
      <div className="feed-section--messages">
        <div className="feed-section__left">
          <div className="feed-section__title">
            Messages & Alerts
          </div>
          <div className="feed-section__filters">
            <DropdownField options={filterButtons} />
          </div>
          <div className="feed-section--activity-content">
            {[...allActivities].map((activity, idx) => <MessageCard activity={activity} fetchButtonFromId={fetchButtonFromId} key={idx} />)}


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
          <NotificationsUserButton buttonActivities={allActivities} button={true} sendNewMessage={sendNewMessage} closeConversation={closeConversation}/>
        </div>
        <div className="feed-section__right">
          derecha
        </div>
      </div>

    </div>

  );
}

export function NotificationsUserButton({buttonActivities, button, closeConversation, sendNewMessage}) {
  const messageContent = useRef(null)
  if(!button)
  {
    return (<></>)
  }
  return (
    <div>
          <div className="popup__header">
            <header className="popup__header-content">
              <div className="popup__header-left">
                {/* <button className="popup__header-button"> */}
                  <div className="btn-circle__icon">
                    <a href="#" onClick={() => {closeConversation()}}>
                      <IoClose />
                    </a>
                  </div>
                {/* </button> */}
              </div>
              <div className="popup__header-center">
                <h1 className="popup__header-title">
                  Username
                </h1>
              </div>

              <div className="popup__header-right">
                <a href="#" onClick={() => store.emit(new SetMainPopupCurrentButton(button))}>{button.title}</a>
              </div>
            </header>
          </div>
          {buttonActivities.map((activity, idx) => <NoticeInnerCard activity={activity} key={idx} />)}


          <form className="feeds__new-message" >

            {/* <button className="btn-circle">
              <div className="btn-circle__content">
                <div className="btn-circle__icon">
                  <IoClose />
                </div>
              </div>
            </button> */}
            <div className="feeds__new-message-message">
              <FieldText
                name="message"
                ref={messageContent}
                // label={t('buttonFilters.price')}
                // explain={t('buttonFilters.priceExplain')}
                // multiInput={true}
                // placeholder={t('buttonFilters.minPricePlaceholder')}
                // {...register('minPrice')}
              />
              {/* <input className="form__input feeds__new-message-input"></input> */}
            </div>
            <div className="btn-circle" onClick={() => {
              sendNewMessage(messageContent.current.value)
              }
            }>
              <div className="btn-circle__content">
                <div className="btn-circle__icon">
                  <IoSend />
                </div>
              </div>
            </div>

          </form>
          </div>
  )
}

export function MessageCard({ activity, fetchButtonFromId }) {
  return (
    <div className="feed-element">
      <div onClick={() => fetchButtonFromId(activity.buttonId, activity.consumerId)} className="card-notification">
        <div className="card-notification__content">
          <div className="card-notification__avatar">
            <div className="avatar-medium">
              <ImageWrapper
                imageType={ImageType.avatarMed}
                src={activity.image}
                alt="image"
              />
            </div>
          </div>
          <div className="card-notification__text">
            <div className="card-notification__header">
              <div className="card-notification__info">
                <div className="">{readableTimeLeftToDate(activity.createdAt)}</div>&nbsp;-&nbsp;<div className=""> {activity.type}</div>
              </div>

            </div>
            <h2 className={`card-notification__title ` + (!activity.read && 'card-notification--unread') }>
              {activity.title}
            </h2>
            <div className="card-notification__paragraph">
              <div className={(!activity.read && 'card-notification--unread')}>
              {activity?.premessage}{activity.message}
              </div>
            </div>
            <div>
              {activity?.footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}


function NoticeInnerCard({ activity }) {
  if (activity.eventName == ActivityEventName.Message) {
    if (activity.from) {
      return (<div className="message message--you">
        <div className="message__header">
          <div className="message__avatar">
            <img src="https://dummyimage.com/30/#ccc/fff" alt="Avatar" className="avatar picture__img"></img>
          </div>

          <div className="message__user-name-container">
            <p className="message__user-name">{activity.from}</p>
          </div>
        </div>
        <div className="message__content">
          {activity.message}
        </div>
      </div>)
    } else {
      return (<div className="feed-section__center__messages">
        <div className="message__hour">
          {readableTimeLeftToDate(activity.createdAt)}
        </div>
        <div className="message message--me">
          <div className="message__content">
            {activity.message}
          </div>
        </div>

      </div>)
    }

  }
  if (activity.link) {
    return (
      <div>
        <a href={activity.link}>
          <b>{activity.message}</b>
        </a>
      </div>
    )
  }
  return (
    <div>
      <b>{activity.message}</b>
    </div>
  )
  // return <>{JSON.stringify(activity)}</>
}