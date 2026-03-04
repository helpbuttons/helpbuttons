import { useButtonTypes } from "shared/buttonTypes";
import { useEffect, useState } from "react";
import _ from 'lodash';
import {  GlobalState, store, useGlobalStore} from "state";
import { ActivityButton } from "components/feed/Activities/ActivityButton";
import ActivityList from "components/feed/Activities/ActivityList";
import { useIsMobile } from "elements/SizeOnly";
import { Dropdown, DropdownLine } from "elements/Dropdown/Dropdown";
import PopupHeader from "components/popup/PopupHeader";
import { useRouter } from "next/router";
import t from "i18n";
import { IoChatboxOutline } from "react-icons/io5";
import { ButtonShow } from "components/button/ButtonShow";
import { FindAndSetMainPopupCurrentButton, SetMainPopupCurrentButton } from "state/HomeInfo";
import ActivityGroup, { ActivityGroupChat } from "./ActivityGroup";
import { FindLatestActivities } from "state/Activity";

export default function ActivitiesUser() {
  const buttonTypes = useButtonTypes()
  const [localFilters, setLocalFilters] = useState(null)

  const [selectedActivity, setSelectedActivity] = useState(null)
  const [filteredUserActivities, setFilteredUserActivities] = useState([])
  const [selectedGroupMessageType, setSelectedGroupMessageType] = useState(null)
  
  const userButtonActivities = useGlobalStore((state: GlobalState) => state.activities.buttons)
  const filterButtons = updateFilters(buttonTypes, userButtonActivities)
  const isMobile = useIsMobile()

  const sideBarButton = useSideBarButton()
  const router = useRouter()
  const {draft} = router.query;
  
  const draftButton = useGlobalStore(
    (state: GlobalState) => state.activities.draftButton,
  );
  useEffect(() => {
    if(!draftButton && draft){
      const { draft, ...routerQuery } = router.query;
      router.replace({
        query: { ...routerQuery },
      });
    }
    if(draftButton)
      {
        const _draftActivity = userButtonActivities.find((_activity) => _activity.buttonId == draftButton.id)
        
        if(_draftActivity){
          setSelectedActivity(() => _draftActivity) 
          const { draft, ...routerQuery } = router.query;
              router.replace({
                query: { ...routerQuery },
              });
        }else{
          console.log('not found.. new draft')
        }
      }
  }, [draftButton])

  useEffect(() => {
    if(selectedActivity && draft)
    {
      const { draft, ...routerQuery } = router.query;
      router.replace({
        query: { ...routerQuery },
      });
    }
    if(selectedActivity)
    {
      setSelectedGroupMessageType(() => null)
    }
    if (selectedActivity && !isMobile) {
      console.log(selectedActivity)
      store.emit(new FindAndSetMainPopupCurrentButton(selectedActivity.buttonId))
    }
    if(!selectedActivity)
    {
      store.emit(new SetMainPopupCurrentButton(null))
    }
  }, [selectedActivity])

  useEffect(() => {
    if (selectedGroupMessageType) {
      setSelectedActivity(() => null)
    }
  }, [selectedGroupMessageType])
  useEffect(() => {
    if(selectedGroupMessageType)
    {
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
    setSelectedGroupMessageType(() => null)
    setSelectedActivity(() => null)
  }, [])
  const setButtonType = (type) => {
    setLocalFilters(() => {return {buttonType: type}})
  }
  
  const closeConversation = () => {
    setSelectedActivity(() => null)
  }
  if (isMobile) {
    return (<div className="feed__container">
      <div className="feed-section--messages">

        {!selectedActivity && !selectedGroupMessageType && !sideBarButton && !draft &&
          <div className="feed-section__left">
            <PopupHeader>{t('activities.title')}</PopupHeader>
            <div className="feed-section__filters">
              <DropdownLine options={filterButtons} onChange={setButtonType} name="activityType" />
            </div>
            <div className="feed-section__left__header">
              <div className="feed-section__filters--desktop">
                <Dropdown options={filterButtons} onChange={setButtonType} />
              </div>
            </div>
            <div className="feed-section--activity-content">
              <ActivityGroup groupMessageType={selectedGroupMessageType} setGroupMessageType={setSelectedGroupMessageType} />
              {/* <div>{t('activities.buttons')}</div> */}
              <ActivityList selectedActivity={selectedActivity} activities={filteredUserActivities} setSelectedActivity={setSelectedActivity} isDrafting={draft} />
            </div>
          </div>
        }
        {((selectedActivity && !sideBarButton) || draft) &&
          <div className="feed-section__center">
            <ActivityButton setSelectedActivity={setSelectedActivity} closeConversation={closeConversation} selectedActivity={selectedActivity} isDrafting={draft} />
            <div className="feed-section__center__chat"></div>
          </div>
        }
        {selectedGroupMessageType &&
          <div className="feed-section__center">
            <ActivityGroupChat groupType={selectedGroupMessageType} close={() => setSelectedGroupMessageType(() => null)} />
          </div>
        }
      </div>
    </div>
    )
  } else {
    return (
      <div className="feed__container">
        <div className="feed-section--messages">
          <div className="feed-section__left">
            <PopupHeader>{t('activities.title')}</PopupHeader>
            <div className="feed-section__left__header">
              <div className="feed-section__filters--desktop">
                <Dropdown options={filterButtons} onChange={setButtonType} />
              </div>
            </div>
            <div className="feed-section--activity-content">
              <ActivityGroup groupMessageType={selectedGroupMessageType} setGroupMessageType={setSelectedGroupMessageType}/>
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
              <ActivityGroupChat groupType={selectedGroupMessageType} close={() => setSelectedGroupMessageType(() => null)} />
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
            {(sideBarButton && selectedActivity?.buttonId == sideBarButton.id) && <ButtonShow button={sideBarButton} />}
          </div>
        </div>

      </div>
    );
  }
}


const updateFilters = (buttonTypes, activities) => {
  const [filterButtons, setFilterButtons] = useState([{ value: "all", name: "all" }])

  useEffect(() => {
    if (buttonTypes?.length > 0 && activities.length > 0) {
      const allTypes = _.uniq(activities.map((activity) => activity.buttonType)).filter((t) => t ? true : false)
      const fullTypes = allTypes.map((_btnType) => buttonTypes.find((btnType) => { return btnType.name == _btnType }))
      const newTypes = fullTypes.map((btnType) => { return { name: btnType?.caption ? btnType.caption : 'unknown', value: btnType?.name ? btnType.name : 'unknown' } });
      setFilterButtons(() => [{ value: "all", name: "all" }, ...newTypes])
    }
  }, [buttonTypes, activities])
  return filterButtons;
}

const useSideBarButton = () => {
  const mainPopupButton = useGlobalStore((state: GlobalState) => state.homeInfo.mainPopupButton)
  const isMobile = useIsMobile()

  const [sideBarButton, setSideBarButton] = useState(null);
  useEffect(() => {
    if (!mainPopupButton || isMobile) {
      return;
    }
    setSideBarButton(() => mainPopupButton)
    store.emit(new SetMainPopupCurrentButton(null))
  }, [mainPopupButton])
  return sideBarButton
}
