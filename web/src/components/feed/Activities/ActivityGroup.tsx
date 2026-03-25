import { GlobalState, store, useGlobalStore } from "state";
import { ActivityListEntryCard, ActivityListEntryCardInner } from "./ActivityListEntry"
import { Role } from "shared/types/roles";
import { useSelectedNetwork } from "state/Networks";
import t from "i18n";
import { GroupMessageType } from "shared/types/group-message.enum";
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { IoArrowBack, IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import FieldText from "elements/Fields/FieldText";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";
import { FindGroupMessages, FindLatestActivities, SendNewGroupMessage, uniqById } from "state/Activity";
import { useScroll } from "shared/helpers/scroll.helper";
import { ActivityDetailMessage } from "./ActivityButton";
import { ActivitiesPageSize } from "shared/dtos/activity.dto";
import { ShowMobileOnly } from "elements/SizeOnly";
import router from "next/router";

export default function ActivityGroup({ selectedGroupType }) {
  const sessionUser = useGlobalStore(
    (state: GlobalState) => state.sessionUser,
  );
  const userGroupMessages = useGlobalStore((state: GlobalState) => state.activities)
  const isAdmin = sessionUser.role == Role.admin;
  if (isAdmin) {
    return <>
      <ActivityGroupMessageEntry selectedGroupType={selectedGroupType} groupType={GroupMessageType.admin} groupMessages={userGroupMessages.admin} />
      <ActivityGroupMessageEntry selectedGroupType={selectedGroupType} groupType={GroupMessageType.community} groupMessages={userGroupMessages.community} />
    </>
  }
  if (!userGroupMessages.community && !isAdmin) {
    return <></>
  }
  return (<>
    <ActivityGroupMessageEntry selectedGroupType={selectedGroupType} groupType={GroupMessageType.community} groupMessages={userGroupMessages.community} />
  </>)
}

function ActivityGroupMessageEntry({ groupMessages, selectedGroupType, groupType }) {

  if (!groupMessages) {
    return <ActivityGroupCreate selectedGroupType={selectedGroupType} groupType={groupType} onClick={() => router.push(`/Activity/${groupType}`)} />
  }

  return <ActivityListEntryCard selected={groupType == selectedGroupType} activity={{ ...groupMessages, type: t(`groupChat.${groupType}`) }} onClick={() => router.push(`/Activity/${groupType}`)} />
}

export function ActivityGroupCreate({ selectedGroupType, groupType, onClick }) {
  const selectedNetwork = useSelectedNetwork()

  return (
    <div className="feed-element">
      <div className={`card-notification ${selectedGroupType == groupType ? 'card-notification--selected' : ''}`} onClick={onClick}>

        <ActivityListEntryCardInner image={selectedNetwork.logo} createdAt={null} type={t(`groupChat.${groupType}`)} read={false} premessage={null} message={t('groupChat.create', [t(`groupChat.${groupType}`)])} footer="" title="" />
      </div>
    </div>
  )
}


export function ActivityGroupChat({ groupType, close }) {
  const [messages, setMessages] = useState(null)
  const activities = useGlobalStore((state: GlobalState) => state.activities)

  const loadMessages = (page, onSuccess) => {
    store.emit(new FindGroupMessages(groupType, page, (_messages) => {
      onSuccess(_messages)
    }))
  }

  useEffect(() => {
    let latestMessageFromPoll = null
    if(groupType == GroupMessageType.admin){
      if(activities.admin){
        latestMessageFromPoll = activities.admin.createdAt;
      }
    }

    if(groupType == GroupMessageType.community){
      if(activities.community){
        latestMessageFromPoll = activities.community.createdAt;
      }
    }
    if(messages?.length > 0)
    {
      const latestMessage = messages[0].createdAt
      if(latestMessageFromPoll > latestMessage){
        loadMessages(0, (_msgs) => {
          setMessages((prev) => uniqById( _msgs, prev))
        })
      }
    }else{
      loadMessages(0, (_msgs) => {
        setMessages((prev) => uniqById( _msgs, prev))
      })
    }
    
  }, [activities])

  const sendNewMessage = (message, groupType, onSuccess) => {
    store.emit(new SendNewGroupMessage(groupType, message, () => {
      onSuccess()
      store.emit(new FindLatestActivities())
    }))
  }

  return (
    <>
      <ActivityGroupChatDetailHeader closeConversation={close} groupType={groupType} />
      <ActivityGroupMessages messages={messages} loadMessages={loadMessages} groupType={groupType} setMessages={setMessages}/>
      {(messages?.length < 1 ) && <div className="chat__notice">{t('groupChat.creating')}</div>}
      <ActivityGroupMessageForm sendNewMessage={sendNewMessage} groupType={groupType} />
    </>
  )
}

function ActivityGroupMessages({ messages, loadMessages, setMessages, groupType }) {
  const [page, setPage] = useState(0)
  useEffect(() => {
    if(groupType)
    {
      setMessages(() => [])
      setPage(() => 0)
    }
  }, [groupType])
  const { endDivLoadMoreTrigger, noMoreToLoad, scrollIsLoading } = useScroll(
    ({ setNoMoreToLoad, setScrollIsLoading }) => {
      setScrollIsLoading(() => true)
      loadMessages(page, (_msgs) => {
        if (_msgs.length < ActivitiesPageSize  - 1) {
          setNoMoreToLoad(() => true)
        }else{
          setNoMoreToLoad(() => false)
        }
        setMessages((prev) => uniqById(prev, _msgs))
        setScrollIsLoading(() => false)
      })
      setPage(() => page +1 )
    },groupType
  );

  return (
    <div className="chat__messages">
      {messages && messages.map((message, idx) => <ActivityDetailMessage key={idx} activity={message}/>)}
      {endDivLoadMoreTrigger}
    </div>
  )
}

function ActivityGroupChatDetailHeader({ closeConversation, groupType }) {
  const selectedNetwork = useSelectedNetwork()

  return (
    <div className="chat__header">
      <header className="chat__header-content">
          <div className="chat__header-left">
            <ShowMobileOnly>
              <div className="btn-circle__icon btn-circle--big-icon">
                {closeConversation &&
                  <a href="#" onClick={() => { closeConversation() }}>
                    <IoArrowBack />
                  </a>
                }
              </div>
           </ShowMobileOnly>
          </div>
        <div className="chat__header-center">
          <h1 className="chat__header-title">
            {t(`groupChat.${groupType}`)}
          </h1>
          <h2 className="chat__header-subtitle">
          </h2>
        </div>
        <div className="chat__header-right">
          <div className="avatar-medium">
            <ImageWrapper
              src={selectedNetwork.logo}
              imageType={ImageType.avatar}
              alt="image"
            />
          </div>
        </div>

      </header>
    </div>)
}


// TODO: refator to unite with  MessageForm from ActivityButton
function ActivityGroupMessageForm({ sendNewMessage, groupType }) {
  const messageContent = useRef(null)
  const inputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === 'Enter' || e.key === ',') && val) {
      e.preventDefault();
      sendMessage()
    }
  }

  const sendMessage = () => {
    // TODO: IMPLEMENT SEND NEW GROUP MESSAGE
    //   sendNewGroupMessage(messageContent.current.value, groupType)
    const message = messageContent.current.value; 
    if(message.length < 1)
    {
      return;
    }
    sendNewMessage(messageContent.current.value, groupType, () => {
      messageContent.current.value = ''
    })
  }
  return (
    <form className="chat__new-message">
      <div className="chat__new-message__message">
        <FieldText
          name="message"
          ref={messageContent}
          label={""}
          classNameInput={"form__input"}
          onInputKeyDown={inputKeyDown}
          multiInput={true}
          autoFocus={true}
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