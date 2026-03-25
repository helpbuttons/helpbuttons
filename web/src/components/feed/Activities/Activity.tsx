import { useButtonTypes } from "shared/buttonTypes";
import { useEffect, useState } from "react";
import _ from 'lodash';
import {  GlobalState, store, useGlobalStore} from "state";
import { ActivityButton } from "components/feed/Activities/ActivityButton";
import ActivityList from "components/feed/Activities/ActivityList";
import { ShowDesktopOnly, ShowMobileOnly, useIsMobile } from "elements/SizeOnly";
import { Dropdown, DropdownLine } from "elements/Dropdown/Dropdown";
import PopupHeader from "components/popup/PopupHeader";
import { useRouter } from "next/router";
import t from "i18n";
import { IoChatboxOutline } from "react-icons/io5";
import { ButtonShow } from "components/button/ButtonShow";
import { FindAndSetMainPopupCurrentButton, SetMainPopupCurrentButton } from "state/HomeInfo";
import ActivityGroup, { ActivityGroupChat } from "./ActivityGroup";
import { FindLatestActivities, SetDraftButton } from "state/Activity";
import { FindButton, updateCurrentButton } from "state/Explore";

export default function ActivitiesUser({ activityId =null, draft = false, selectedGroupMessageType = null }) {
  const buttonTypes = useButtonTypes()
  const [localFilters, setLocalFilters] = useState(null)

  const [selectedActivity, setSelectedActivity] = useState(null)
  const [filteredUserActivities, setFilteredUserActivities] = useState([])
  
  const userButtonActivities = useGlobalStore((state: GlobalState) => state.activities.buttons)
  const filterButtons = updateFilters(buttonTypes, userButtonActivities)
  const isMobile = useIsMobile()

  const router = useRouter()
  
  useEffect(() => {
    if (activityId) {
      const activity = userButtonActivities.find((a) => a.id === activityId);
      if (activity) {
        setSelectedActivity(() => activity);
      }
    }
  }, [activityId]);
  
  const draftButton = useGlobalStore(
    (state: GlobalState) => state.activities.draftButton,
  );
  const sideBarButton = useSideBarButton(selectedActivity, draft)
  const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)
  useEffect(() => {
    if(draftButton)
      {
        const _draftActivity = userButtonActivities.find((_activity) => _activity.buttonId == draftButton.id)
        
        if(_draftActivity){
          setSelectedActivity(() => _draftActivity) 
        }else{
          console.log('not found.. new draft')
        }
      }
  }, [draftButton])
  useEffect(() => {
    if (selectedGroupMessageType) {
      setSelectedActivity(() => null)
    }
  }, [selectedGroupMessageType])

  useEffect(() => {
    setFilteredUserActivities(() => {
      if(localFilters)
      {
        return userButtonActivities.filter((_activity) => {
          if(localFilters.buttonType == 'all') 
          {
            return true;
          }
          return _activity.buttonType == localFilters.buttonType
        })
      }
      return userButtonActivities
    })
  }, [userButtonActivities, localFilters])

  useEffect(() => {
    store.emit(new FindLatestActivities())
  }, [])
  const setButtonType = (type) => {
    setLocalFilters(() => {return {buttonType: type}})
  }
  
  const closeConversation = () => {
    router.push('/Activity')
  }
  return <>
    <ShowDesktopOnly>
    <div className="feed__container">
        <div className="feed-section--messages">
          <div className="feed-section__left">
             <div className="chat__header">
                <header className="chat__header-content">
                  {t('activities.title')}
                </header>
            </div>
            <div className="feed-section__left__header">
              <div className="feed-section__filters--desktop">
                <Dropdown options={filterButtons} onChange={setButtonType} />
              </div>
            </div>
            <div className="feed-section--activity-content">
              <ActivityGroup selectedGroupType={selectedGroupMessageType}/>
              <ActivityList selectedActivity={selectedActivity} activities={filteredUserActivities} setSelectedActivity={setSelectedActivity} isDrafting={draft} />
            </div>
          </div>
          {(selectedActivity || draft) &&
            <div className="feed-section__center">
              <ActivityButton setSelectedActivity={setSelectedActivity} closeConversation={closeConversation} selectedActivity={selectedActivity} isDrafting={draft} />
              <div className="feed-section__center__chat"></div>

            </div>
          }
          {selectedGroupMessageType &&
            <div className="feed-section__center">
              <ActivityGroupChat groupType={selectedGroupMessageType} close={closeConversation} />
            </div>
          }
          {(!selectedActivity && !draft && !selectedGroupMessageType) &&
            <>
              <div className="feed-section__center feed-section__center--no-select">
                <div className="feed-section__center__chat feed-section__center__chat-no-select">
                  <IoChatboxOutline />
                  {t('activities.pickOne')}
                </div>
              </div>
            </>
          }

          <div className="feed-section__right">
            {sideBarButton && <ButtonShow button={currentButton} hideSendPrivateMessage={true} hideFooter={true}/>}
          </div>
        </div>

      </div>
    </ShowDesktopOnly>
    <ShowMobileOnly>
    <div className="feed__container">
      <div className="feed-section--messages">

        {!selectedActivity && !selectedGroupMessageType && !draft &&
          <div className="feed-section__left">
            <div className="popup__header">
                <header className="popup__header-content">
                  <div className="popup__header-center">
                    <h1 className="popup__header-title">
                      {t('activities.title')}

                    </h1>
                  </div>
                </header>
            </div>
            <div className="feed-section__filters">
              <DropdownLine options={filterButtons} onChange={setButtonType} name="activityType" />
            </div>
            <div className="feed-section__left__header">
              <div className="feed-section__filters--desktop">
                <Dropdown options={filterButtons} onChange={setButtonType} />
              </div>
            </div>
            <div className="feed-section--activity-content">
              <ActivityGroup selectedGroupType={selectedGroupMessageType} />
              {/* <div>{t('activities.buttons')}</div> */}
              <ActivityList selectedActivity={selectedActivity} activities={filteredUserActivities} setSelectedActivity={setSelectedActivity} isDrafting={draft} />
            </div>
          </div>
        }
        {((selectedActivity) || draft) &&
          <div className="feed-section__center">
            <ActivityButton setSelectedActivity={setSelectedActivity} closeConversation={closeConversation} selectedActivity={selectedActivity} isDrafting={draft} />
            <div className="feed-section__center__chat"></div>
          </div>
        }
        {selectedGroupMessageType &&
          <div className="feed-section__center">
            <ActivityGroupChat groupType={selectedGroupMessageType} close={closeConversation} />
          </div>
        }
      </div>
    </div>
    </ShowMobileOnly>
  </>
}


const updateFilters = (buttonTypes, activities) => {
  const [filterButtons, setFilterButtons] = useState([{ value: "all", name: (t("activities.all")) }])

  useEffect(() => {
    if (buttonTypes?.length > 0 && activities.length > 0) {
      const allTypes = _.uniq(activities.map((activity) => activity.buttonType)).filter((t) => t ? true : false)
      const fullTypes = allTypes.map((_btnType) => buttonTypes.find((btnType) => { return btnType.name == _btnType }))
      const newTypes = fullTypes.map((btnType) => { return { name: btnType?.caption ? btnType.caption : 'unknown', value: btnType?.name ? btnType.name : 'unknown' } });
      setFilterButtons(() => [{ value: "all", name: t("activities.all") }, ...newTypes])
    }
  }, [buttonTypes, activities])
  return filterButtons;
}

const useSideBarButton = (selectedActivity, isDraft) => {
  const draftButton = useGlobalStore((state: GlobalState) => state.activities.draftButton);
  const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton);
  
  const [sideBarButton, setSideBarButton] = useState(false);

  useEffect(() => {
    if (selectedActivity?.buttonId && selectedActivity?.buttonId != currentButton?.id){
        store.emit(new FindButton(selectedActivity.buttonId, (button) => {
          setSideBarButton(() => true)
          store.emit(new updateCurrentButton(button))
        }))
    }else if(draftButton){
      // setSideBarButton(() => draftButton)
      store.emit(new FindButton(draftButton.id, (button) => {
        setSideBarButton(() => true)
        store.emit(new updateCurrentButton(button))
      }))
    }else if(!(selectedActivity?.buttonId)){
      setSideBarButton(() => null)
      store.emit(new updateCurrentButton(null))
    }
  }, [selectedActivity, draftButton])

  return sideBarButton
}
