import t from "i18n";
import { useButtonTypes } from "shared/buttonTypes";
import { useEffect, useState } from "react";
import _ from 'lodash';
import { FindActivityDetails, SendNewMessage } from "state/Activity";
import {  GlobalState, store, useGlobalStore} from "state";
import { FindButton } from "state/Explore";
import { ActivityDetail } from "components/feed/Activities/ActivityDetail";
import ActivityList from "components/feed/Activities/ActivityList";
import { alertService } from "services/Alert";
import { usePoolFunc } from "shared/custom.hooks";
import { ShowDesktopOnly, ShowMobileOnly } from "elements/SizeOnly";
import Btn, { BtnType, ContentAlignment } from "elements/Btn";
import { Dropdown, DropdownLine } from "elements/Dropdown/Dropdown";
import PopupHeader from "components/popup/PopupHeader";



const updateFilters = (buttonTypes, activities) => {
  const [filterButtons, setFilterButtons] = useState([{ value: "all", name: "all" }])

  useEffect(() => {
    if (buttonTypes?.length > 0 && activities.length > 0) {
      const allTypes = _.uniq(activities.map((activity) => activity.buttonType)).filter((t) => t ? true : false)
      console.log(allTypes)
      const fullTypes = allTypes.map((_btnType) => buttonTypes.find((btnType) => { return btnType.name == _btnType }))
      const newTypes = fullTypes.map((btnType) => { return { name: btnType?.caption ? btnType.caption : 'unknown', value: btnType?.name ? btnType.name : 'unknown' } });
      setFilterButtons(() => [{ value: "all", name: "all" }, ...newTypes])
    }
  }, [buttonTypes, activities])
  return filterButtons;
}

export default function ActivitiesUser() {

  const buttonTypes = useButtonTypes()
  // K pasa se es creado un nuevo post... ? Como se va a mirar? no es un mensaje...
  

  

  // const [buttonPage, setButtonPage] = useState(0)
  const [buttonActivities, setButtonActivities] = useState([])
  const [localFilters, setLocalFilters] = useState(null)

  const [selectedActivity, setSelectedActivity] = useState(null)
  const [filteredUserActivities, setFilteredUserActivities] = useState([])
  const [selectedButton, setSelectedButton] = useState(null)


  useEffect(() =>{ console.log('oia'); console.log(buttonActivities)}, [buttonActivities])
  const findActivityDetails = () => {
    store.emit(new FindActivityDetails(selectedActivity.buttonId, selectedActivity.consumerId, 0,
      (_activites) => {
        setButtonActivities(() => _activites)
      }
    ))
  }

  useEffect(() => {
    if(!selectedActivity)
    {
      return;
    }
    findActivityDetails()
    store.emit(new FindButton(selectedActivity.buttonId, (button) => {
      setSelectedButton(() => button)
    }))
  }, [selectedActivity])

  const userActivities = useGlobalStore((state: GlobalState) => state.activities.activities)
  const filterButtons = updateFilters(buttonTypes, userActivities)

  useEffect(() => {
    setFilteredUserActivities(() => {
      if(localFilters)
      {
        return userActivities.filter((_activity) => {
          if(localFilters.buttonType == 'all') 
          {
            return true;
          }
          return _activity.buttonType == localFilters.buttonType
        })
      }
      return userActivities
    })
  }, [userActivities, localFilters])

  const setButtonType = (type) => {
    setLocalFilters(() => {return {buttonType: type}})
  }
  
  usePoolFunc({paused: !selectedActivity, timeMs: 10*1000, func:() => findActivityDetails()})
  
  const sendNewMessage = (message, buttonId, consumerId) => {
    store.emit(new SendNewMessage(message, buttonId, consumerId, () => { findActivityDetails(); alertService.success(t('activities.sent')) }))
  }

  const closeConversation = () => {
    setButtonActivities(() => [])
    setSelectedButton(() => null)
    setSelectedActivity(() => null)
  }
  return (
    <div className="feed__container">
      <div className="feed-section--messages">
        <div className="feed-section__left">
                        <PopupHeader >Messages & Alerts</PopupHeader>

          <div className="feed-section__left__header">


            <div className="feed-section__filters">
              <ShowMobileOnly><DropdownLine options={filterButtons} onChange={setButtonType}/></ShowMobileOnly>
              <ShowDesktopOnly><Dropdown options={filterButtons} onChange={setButtonType}/></ShowDesktopOnly>
            </div>
          </div>
          <div className="feed-section--activity-content">
            <ActivityList userActivities={filteredUserActivities} setSelectedActivity={setSelectedActivity} />
          </div>
        </div>
        <ActivityDetailMobile>
          <div className="feed-section__center">
            <ActivityDetail buttonActivities={buttonActivities} button={selectedButton} sendNewMessage={sendNewMessage} closeConversation={closeConversation} selectedActivity={selectedActivity} />
          </div>
        </ActivityDetailMobile>
        <div className="feed-section__right">
        </div>
      </div>

    </div>
  );
}

function ActivityDetailMobile({ children }) {
  
  return (<><ShowMobileOnly>
    <div className='card-profile__container'>
      {children}
    </div>
  </ShowMobileOnly>
    <ShowDesktopOnly>
      {children}
    </ShowDesktopOnly>
  </>
  )
  }