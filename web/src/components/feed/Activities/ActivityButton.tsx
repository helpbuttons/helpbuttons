import Loading from "components/loading"
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn"
import FieldText from "elements/Fields/FieldText"
import ImageWrapper, { ImageType } from "elements/ImageWrapper"
import { ShowMobileOnly } from "elements/SizeOnly"
import t from "i18n"
import router, { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { IoAdd, IoArrowBack, IoSend } from "react-icons/io5"
import { alertService } from "services/Alert"
import { usePoolFunc } from "shared/custom.hooks"
import { readableTimeLeftToDate } from "shared/date.utils"
import { ActivityEventName } from "shared/types/activity.list"
import { GlobalState, store, useGlobalStore } from "state"
import { FindActivityDetails, FindMoreActivities, FindNewActivities, SendNewMessage, SetFocusOnMessage, SetFocusOnPost } from "state/Activity"
import { FindButton } from "state/Explore"
import { FindAndSetMainPopupCurrentButton, FindAndSetMainPopupCurrentProfile } from "state/HomeInfo"

export function ActivityButton({ selectedActivity, setSelectedActivity, closeConversation, isDrafting }) {

  if (isDrafting) {
    return <ActivityDetailDraft setSelectedActivity={setSelectedActivity} />
  }
  return <ActivityDetailConversation selectedActivity={selectedActivity} closeConversation={closeConversation} />
}

const findActivityDetails = (buttonId, consumerId, setSelectedButton, setButtonActivities) => {
  if (!buttonId) {
    return;
  }
  store.emit(new FindActivityDetails(buttonId, consumerId, 0,
    (_activites) => {
      store.emit(new FindButton(buttonId, (button) => {
        setSelectedButton(() => button)
      }))
      setButtonActivities(() => _activites)
    }
  ))
}

export function ActivityDetailConversation({ selectedActivity, closeConversation }) {
  const [buttonActivities, setButtonActivities] = useState([])
  const [selectedButton, setSelectedButton] = useState(null)

  const loadActivities = () => {
    findActivityDetails(selectedActivity.buttonId, selectedActivity.consumerId, setSelectedButton, setButtonActivities)
  }

  useEffect(() => {
    if (!selectedActivity) {
      return;
    }
    loadActivities()
  }, [selectedActivity])

  usePoolFunc({ paused: !selectedActivity, timeMs: 10 * 1000, func: () => loadActivities() })

  const sendNewMessage = (message, buttonId, consumerId) => {
    store.emit(new SendNewMessage(message, buttonId, consumerId, () => { loadActivities(); alertService.success(t('activities.sent')) }))
  }

  if (!selectedButton || !selectedActivity) {
    return (<ShowMobileOnly><Loading /></ShowMobileOnly>)
  }

  if (!selectedActivity.activityFrom) {
    return (<>?</>)
  }

  return (
    <>
      <ActivityDetailHeader button={selectedButton} selectedActivity={selectedActivity} closeConversation={closeConversation} />
      <ActivityDetailList buttonActivities={buttonActivities} />
      {!selectedActivity?.disableChat && <MessageForm sendNewMessage={sendNewMessage} buttonId={selectedButton.id} consumerId={selectedActivity.consumerId} />}
    </>
  )
}

export function ActivityDetailDraft({ setSelectedActivity }) {
  const sendNewMessage = (message, buttonId, consumerId) => {
    store.emit(new SendNewMessage(message, buttonId, consumerId, (res) => {
      store.emit(new FindNewActivities((_activities) => {
        const _draftActivity = _activities.find((_activity) => _activity.buttonId == buttonId)

        if (_draftActivity) {
          setSelectedActivity(() => _draftActivity)
          const { draft, ...routerQuery } = router.query;
          router.replace({
            query: { ...routerQuery },
          });
        }
      }))

      alertService.success(t('activities.sent'))
    }))
  }
  const draftButton = useGlobalStore(
    (state: GlobalState) => state.activities.draftButton,
  );
  const sessionUser = useGlobalStore(
    (state: GlobalState) => state.sessionUser,
  );
  if (!draftButton) {
    return <></>
  }
  const draftActivity = {
    activityFrom: {
      name: draftButton.owner.name,
      username: draftButton.owner.username
    },
    image: draftButton.image,
    buttonId: draftButton.id
  }

  const closeDraft = () => {
    router.push(`/Activity`)
  }
  return (
    <>
      <ActivityDetailHeader button={draftButton} selectedActivity={draftActivity} closeConversation={closeDraft} />
      <MessageForm sendNewMessage={sendNewMessage} buttonId={draftButton.id} consumerId={sessionUser.id} />
    </>
  )
}


function MessageForm({ sendNewMessage, buttonId, consumerId }) {
  const messageContent = useRef(null)
  const inputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === 'Enter' || e.key === ',') && val) {
      e.preventDefault();
      sendMessage()
    }
  }

  const sendMessage = () => {
    sendNewMessage(messageContent.current.value, buttonId, consumerId)
    messageContent.current.value = ''
  }
  return (
    <form className="chat__new-message">

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
          onInputKeyDown={inputKeyDown}
          multiInput={true}
        />
      </div>
      <div className="chat__new-message__send">
        <Btn
          btnType={BtnType.circle}
          iconLink={<IoSend />}
          iconLeft={IconType.circle}
          contentAlignment={ContentAlignment.center}
          onClick={() => {
            sendMessage()
          }}
        />
      </div>

    </form>
  )
}
function ActivityDetailCard({ activity }) {
  if (activity.eventName == ActivityEventName.Message) {
    return <ActivityDetailMessage activity={activity} />
  }

  if (activity.messageId) { //eventName == ActivityEventName.NewPostComment){
    const jumpToMessage = (buttonId, messageId) => {
      if (messageId) {
        store.emit(new SetFocusOnMessage(messageId))
      }
      if (buttonId) {
        store.emit(new FindAndSetMainPopupCurrentButton(buttonId))
      }
    }
    return (
      <>
        <div className="chat__time-passed">
          {readableTimeLeftToDate(activity.createdAt)}
        </div>
        <div className="chat__notice">
          {activity.message}
          <a href="#" onClick={() => jumpToMessage(activity.buttonId, activity.messageId)}>
            {t('common.show')}</a>
        </div>
      </>)
  }

  if (activity.postId) { //eventName == ActivityEventName.NewPostComment){
    const jumpToPost = (buttonId, postId) => {
      console.log('jump to post')
      if (postId) {
        store.emit(new SetFocusOnPost(postId))
      }
      if (buttonId) {
        store.emit(new FindAndSetMainPopupCurrentButton(buttonId))
      }
    }
    return (
      <>
        <div className="chat__time-passed">
          {readableTimeLeftToDate(activity.createdAt)}
        </div>
        <div className="chat__notice">
          {activity.message}
          <a href="#" onClick={() => jumpToPost(activity.buttonId, activity.postId)}>
            {t('common.show')}</a>
        </div>
      </>)
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

function ActivityDetailMessage({ activity }) {
  if (activity.from) {
    return (
      <>

        <div className="message message--you">
          <div className="message__header">
            <div className="message__avatar">
              {/* <ImageWrapper imageType={ImageType.avatar} src={activity.activityFrom.avatar} alt={"ups"}  /> */}
              <img src={activity.activityFrom.avatar} alt="avd1rada" className="avatar picture__img"></img>
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
function ActivityDetailList({ buttonActivities }) {
  return (
    <div className="chat__messages">
      {buttonActivities.map((activity, idx) => <ActivityDetailCard activity={activity} key={idx} />)}

    </div>
  )
}
function ActivityDetailHeader({ closeConversation, button, selectedActivity }) {


  const showUser = (username) => {
    store.emit(new FindAndSetMainPopupCurrentProfile(username))
  }

  const showButton = (buttonId) => {
    store.emit(new FindAndSetMainPopupCurrentButton(buttonId))
  }
  return (
    <div className="chat__header">
      <header className="chat__header-content">
        <div className="chat__header-left">
          <div className="btn-circle__icon">
            {closeConversation &&
              <a href="#" onClick={() => { closeConversation() }}>
                <IoArrowBack />
              </a>
            }
          </div>
        </div>
        <div className="chat__header-center">
          <h1 className="chat__header-title">
            <a href="#" onClick={() => showUser(selectedActivity.activityFrom.username)}>{selectedActivity.activityFrom.name}</a>
          </h1>
          <h2 className="chat__header-subtitle">
            <a href="#" onClick={() => showButton(selectedActivity.buttonId)}>{button.title}</a>
          </h2>
        </div>
        <div className="chat__header-right">
          <div className="avatar-medium">
            <ImageWrapper
              src={selectedActivity.image}
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