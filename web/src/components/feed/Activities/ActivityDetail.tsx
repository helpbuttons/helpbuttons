import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn"
import FieldText from "elements/Fields/FieldText"
import ImageWrapper, { ImageType } from "elements/ImageWrapper"
import { useRef } from "react"
import { IoAdd, IoArrowBack, IoSend } from "react-icons/io5"
import { readableTimeLeftToDate } from "shared/date.utils"
import { ActivityEventName } from "shared/types/activity.list"

export function ActivityDetail({ buttonActivities, button, activity, closeConversation, sendNewMessage }) {
  // const { endDivLoadMoreTrigger, noMoreToLoad } = useScroll(
  //   ({ setNoMoreToLoad, setScrollIsLoading }) => {
  //     setScrollIsLoading(() => true)
  //     console.log('load more...')
  //     // store.emit(new FindMoreActivities((loadedActivities) => {
  //     //     if (loadedActivities.length < 1) {
  //     //         setNoMoreToLoad(() => true)
  //     //     }
  //     //     setScrollIsLoading(() => false)
  //     // }))
  //   },
  // );

  if (!button) {
    return (<></>)
  }

  return (
    <>
      <ActivityDetailHeader button={button} activity={activity} closeConversation={closeConversation} />
      <ActivityDetailList buttonActivities={buttonActivities} />
      <MessageForm sendNewMessage={sendNewMessage} button={button} activity={activity}/>
      
    </>
  )
}

function MessageForm({sendNewMessage, button, activity}) {
  const messageContent = useRef(null)

  return (
  <form className="chat__new-message" >

        <Btn
          btnType={BtnType.circle}
          iconLink={<IoAdd />}
          iconLeft={IconType.circle}
          contentAlignment={ContentAlignment.center}
          onClick={() => {
          }}
        />
        <div className="chat__new-message__message">
          <FieldText
            name="message"
            ref={messageContent}
            label={""}
            classNameInput={"form__input"}
          />
        </div>
        <div className="chat__new-message__send">
          <Btn
            btnType={BtnType.circle}
            iconLink={<IoSend />}
            iconLeft={IconType.circle}
            contentAlignment={ContentAlignment.center}
            onClick={() => {
              sendNewMessage(messageContent.current.value, button.id, activity.consumerId)
              messageContent.current.value = ''
            }}
          />
        </div>

      </form>
  )
}
function ActivityDetailCard({ activity }) {
  if (activity.eventName == ActivityEventName.Message) {
    if (activity.from) {
      return (
        <>

          <div className="message message--you">
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
          </div>
          <div className="message__hour">
            {readableTimeLeftToDate(activity.createdAt)}
          </div>
        </>


      )

    } else {
      return (<>


        <div className="message message--me">

          <div className="message__content">
            {activity.message}
          </div>
        </div>
        <div className="message__hour message__hour--me">
          {readableTimeLeftToDate(activity.createdAt)}
        </div>

      </>)
    }

  }
  if (activity.link) {
    return (
      <>
        <div className="chat__time-passed">
          {readableTimeLeftToDate(activity.createdAt)}
        </div>
        <div className="chat__notice">
          {activity.message}
          <a href={activity.link}>
            Show</a>
        </div>
      </>

    )
  }
  return (
    <div>
      <div className="chat__notice">
        {activity.message}
      </div >
      <div className="message__hour message__hour--me">
        {readableTimeLeftToDate(activity.createdAt)}
      </div>
    </div>
  )
}

function ActivityDetailList({ buttonActivities }) {
  return (
    <div className="chat__messages">
      {buttonActivities.map((activity, idx) => <ActivityDetailCard activity={activity} key={idx} />)}

    </div>
  )
}
function ActivityDetailHeader({ closeConversation, button, activity }) {
  return (
    <div className="chat__header">
      <header className="chat__header-content">
        <div className="chat__header-left">
          <div className="btn-circle__icon">
            <a href="#" onClick={() => { closeConversation() }}>
              <IoArrowBack />
            </a>
          </div>
        </div>
        <div className="chat__header-center">
          <h1 className="chat__header-title">
            {activity.from}
          </h1>
          <h2 className="chat__header-subtitle">
            {button.title}
          </h2>
        </div>
        <div className="chat__header-right">
          <div className="avatar-medium">
            <ImageWrapper
              imageType={ImageType.avatar}
              alt="image"
            />
          </div>
        </div>
        <div className="chat__header-right">
          {/* <a href="#" onClick={() => store.emit(new SetMainPopupCurrentButton(button))}>{button.title}</a> */}
        </div>
      </header>
    </div>)
}