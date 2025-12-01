import { useButtonTypes } from "shared/buttonTypes";
import { useEffect, useState } from "react";
import _ from 'lodash';
import {  GlobalState, useGlobalStore} from "state";
import { ActivityDetail } from "components/feed/Activities/ActivityDetail";
import ActivityList from "components/feed/Activities/ActivityList";
import { ShowDesktopOnly, ShowMobileOnly } from "elements/SizeOnly";
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
  const [localFilters, setLocalFilters] = useState(null)

  const [selectedActivity, setSelectedActivity] = useState(null)
  const [filteredUserActivities, setFilteredUserActivities] = useState([])

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
  
  const closeConversation = () => {
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
            <ShowDesktopOnly>
              <ActivityList userActivities={filteredUserActivities} setSelectedActivity={setSelectedActivity} />
            </ShowDesktopOnly>
            <ShowMobileOnly>
              {!selectedActivity && <ActivityList userActivities={filteredUserActivities} setSelectedActivity={setSelectedActivity} />}
              {(selectedActivity) && 
              <div className='card-profile__container'><ActivityDetail closeConversation={closeConversation} selectedActivity={selectedActivity} /></div>}
            </ShowMobileOnly>
            
          </div>
        </div>
          <div className="feed-section__center">
          <ShowDesktopOnly>
            <ActivityDetail closeConversation={closeConversation} selectedActivity={selectedActivity} />
          </ShowDesktopOnly>
          </div>
        <div className="feed-section__right">
        </div>
      </div>

    </div>
  );
}