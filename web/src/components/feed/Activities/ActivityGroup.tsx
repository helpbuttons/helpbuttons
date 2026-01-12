import { GlobalState, useGlobalStore } from "state";
import { ActivityListEntryCard, ActivityListEntryCardInner } from "./ActivityListEntry"
import { Role } from "shared/types/roles";
import { useSelectedNetwork } from "state/Networks";
import t from "i18n";
import { GroupMessageType } from "shared/types/group-message.enum";
import ImageWrapper, { ImageType } from "elements/ImageWrapper";
import { IoArrowBack, IoSend } from "react-icons/io5";
import router from "next/router";
import { useRef } from "react";
import FieldText from "elements/Fields/FieldText";
import Btn, { BtnType, ContentAlignment, IconType } from "elements/Btn";

export default function ActivityGroup({setCreatingNewChat, creatingNewChat}) {
    const sessionUser = useGlobalStore(
        (state: GlobalState) => state.sessionUser,
    );
    const userGroupMessages = useGlobalStore((state: GlobalState) => state.activities)
    
    if(sessionUser.role == Role.admin)
    {
        return <>
            <div>{t('groupChat.admin_community')}</div>
            <ActivityGroupMessageEntry creatingNewChat={creatingNewChat} setCreatingNewChat={setCreatingNewChat} groupType={GroupMessageType.admin} groupMessage={userGroupMessages.admin} onClick={undefined}/>
            <ActivityGroupMessageEntry creatingNewChat={creatingNewChat}  setCreatingNewChat={setCreatingNewChat} groupType={GroupMessageType.community} groupMessage={userGroupMessages.community} onClick={undefined}/>
        </>
    }
    return (<>
        <div>{t('groupChat.community')}</div>
        <ActivityGroupMessageEntry creatingNewChat={creatingNewChat} setCreatingNewChat={setCreatingNewChat} groupType={GroupMessageType.community} groupMessage={userGroupMessages.community} onClick={undefined}/>
        </>)
}

function ActivityGroupMessageEntry({groupMessage, groupType, onClick, creatingNewChat, setCreatingNewChat})
{
    if(!groupMessage){
        return <ActivityGroupCreate creatingNewChat={creatingNewChat} groupType={groupType} onClick={() => setCreatingNewChat(() => groupType)}/>
    }
    
    return <ActivityListEntryCard activity={{...groupMessage, type: t(`groupChat.${groupType}`)}} onClick={onClick}/>
}

export function ActivityGroupCreate({groupType, onClick, creatingNewChat}) {
    const selectedNetwork = useSelectedNetwork()

    return (
        <div className="feed-element">
            <div className={`card-notification ${creatingNewChat == groupType ? 'card-notification--selected' : ''}`} onClick={onClick}>

                <ActivityListEntryCardInner image={selectedNetwork.logo} createdAt={null} type={t(`groupChat.${groupType}`)} read={false} premessage={null} message={t('groupChat.create', [t(`groupChat.${groupType}`)])} footer="" title="" />
            </div>
        </div>
    )
}


export function ActivityGroupChatCreate({ groupType, setSelectedActivity }) {
    // TODO: 
    const sendNewMessage = (message, buttonId, consumerId) => {
    //   store.emit(new SendNewMessage(message, buttonId, consumerId, (res) => {
    //     store.emit(new FindLatestActivities((_activities) => {
    //       // TODO... get activity from list...
    //       const _draftActivity = _activities.find((_activity) => _activity.buttonId == buttonId)
  
    //       if (_draftActivity) {
    //         setSelectedActivity(() => _draftActivity)
    //         const { draft, ...routerQuery } = router.query;
    //         router.replace({
    //           query: { ...routerQuery },
    //         });
    //       }
    //     }))
    //   }))
    }
    // const draftButton = useGlobalStore(
    //   (state: GlobalState) => state.activities.draftButton,
    // );
    const sessionUser = useGlobalStore(
      (state: GlobalState) => state.sessionUser,
    );
    // if (!draftButton) {
    //   return <></>
    // // }
    // const draftActivity = {
    //   activityFrom: {
    //     name: draftButton.owner.name,
    //     username: draftButton.owner.username
    //   },
    //   image: draftButton.image,
    //   buttonId: draftButton.id
    // }
  
    const close = () => {
      router.push(`/Activity`)
    }
    return (
      <>
        <ActivityGroupChatDetailHeader closeConversation={close} groupType={groupType} />
        <div className="chat__messages">
        
      </div>
      <div className="chat__notice">{t('groupChat.creating')}</div>
        <ActivityGroupMessageForm sendNewMessage={sendNewMessage} groupType={groupType} />
      </>
    )
  }
  
  function ActivityGroupChatDetailHeader({ closeConversation, groupType}) {
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
      messageContent.current.value = ''
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