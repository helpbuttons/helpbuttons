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
import { FindGroupMessages, SendNewGroupMessage } from "state/Activity";
import { ActivityDetailMessage } from "./ActivityButton";
import Loading from "components/loading";

export default function ActivityGroup({ setGroupMessageType, groupMessageType }) {
  const sessionUser = useGlobalStore(
    (state: GlobalState) => state.sessionUser,
  );
  const userGroupMessages = useGlobalStore((state: GlobalState) => state.activities)
  const isAdmin = sessionUser.role == Role.admin;
  if (isAdmin) {
    return <>
      <div>{t('groupChat.admin_community')}</div>
      <ActivityGroupMessageEntry creatingNewChat={groupMessageType} setCreatingNewChat={setGroupMessageType} groupType={GroupMessageType.admin} groupMessages={userGroupMessages.admin} />
      <ActivityGroupMessageEntry creatingNewChat={groupMessageType} setCreatingNewChat={setGroupMessageType} groupType={GroupMessageType.community} groupMessages={userGroupMessages.community} />
    </>
  }
  if (!userGroupMessages.community && !isAdmin) {
    return <></>
  }
  return (<>
    <div>{t('groupChat.community')}</div>
    <ActivityGroupMessageEntry creatingNewChat={groupMessageType} setCreatingNewChat={setGroupMessageType} groupType={GroupMessageType.community} groupMessages={userGroupMessages.community} />
  </>)
}

function ActivityGroupMessageEntry({ groupMessages, groupType, creatingNewChat, setCreatingNewChat }) {

  if (!groupMessages) {
    return <ActivityGroupCreate creatingNewChat={creatingNewChat} groupType={groupType} onClick={() => setCreatingNewChat(() => groupType)} />
  }

  return <ActivityListEntryCard selected={creatingNewChat == groupType} activity={{ ...groupMessages, type: t(`groupChat.${groupType}`) }} onClick={() => setCreatingNewChat(() => groupType)} />
}

export function ActivityGroupCreate({ groupType, onClick, creatingNewChat }) {
  const selectedNetwork = useSelectedNetwork()

  return (
    <div className="feed-element">
      <div className={`card-notification ${creatingNewChat == groupType ? 'card-notification--selected' : ''}`} onClick={onClick}>

        <ActivityListEntryCardInner image={selectedNetwork.logo} createdAt={null} type={t(`groupChat.${groupType}`)} read={false} premessage={null} message={t('groupChat.create', [t(`groupChat.${groupType}`)])} footer="" title="" />
      </div>
    </div>
  )
}


export function ActivityGroupChat({ groupType, close }) {
  const [messages, setMessages] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const activities = useGlobalStore((state: GlobalState) => state.activities)
  const loadMessages = () => {
    store.emit(new FindGroupMessages(groupType,0, (_messages) => {
      setMessages(() => _messages)
      setIsLoading(() => false)
    }))
  }

  useEffect(() => {
    let latestMessageFromPoll = null
    if(groupType == GroupMessageType.admin){
      if(!activities.admin){
        setIsLoading(() => false)
        return;
      }
      latestMessageFromPoll = activities.admin.createdAt;
    }
    if(groupType == GroupMessageType.community){
      if(!activities.community){
        setIsLoading(() => false)
        return;
      }
      latestMessageFromPoll = activities.community.createdAt;
    }

    if(messages)
    {
      const latestMessage = messages[0].createdAt
      if(latestMessageFromPoll > latestMessage){
        loadMessages()
      }
    }
    
  }, [activities])

  useEffect(() => {
      if(groupType)
      {
        loadMessages()
      } else {
        setMessages(() => null)
      }
  }, [groupType])

  const sendNewMessage = (message, groupType, onSuccess) => {
    store.emit(new SendNewGroupMessage(groupType, message, () => {
      onSuccess()
      loadMessages()
    }))
  }

  return (
    <>
      <ActivityGroupChatDetailHeader closeConversation={close} groupType={groupType} />
      <div className="chat__messages">
      {messages && messages.map((message, idx) => <ActivityDetailMessage key={idx} activity={message}/>)}
      {isLoading && <Loading/>}
      </div>
      {(messages?.length < 1 && !isLoading) && <div className="chat__notice">{t('groupChat.creating')}</div>}
      <ActivityGroupMessageForm sendNewMessage={sendNewMessage} groupType={groupType} />
    </>
  )
}

function ActivityGroupChatDetailHeader({ closeConversation, groupType }) {
  const selectedNetwork = useSelectedNetwork()

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