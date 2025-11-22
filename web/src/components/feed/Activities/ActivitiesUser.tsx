import t from "i18n";
import { useButtonTypes } from "shared/buttonTypes";
import { ActivityEventName } from "shared/types/activity.list";
import { useEffect, useState } from "react";
import _ from 'lodash';
import { FindActivityDetails, SendNewMessage } from "state/Activity";
import {  store} from "state";
import { FindButton } from "state/Explore";
import { ActivityDetail } from "components/feed/Activities/ActivityDetail";
import ActivityList from "components/feed/Activities/ActivityList";
import { alertService } from "services/Alert";
import { usePoolFunc } from "shared/custom.hooks";
import { ShowDesktopOnly, ShowMobileOnly } from "elements/SizeOnly";



const updateFilters = (buttonTypes, activities) => {
  const [filterButtons, setFilterButtons] = useState([{ value: "all", name: "all" }])

  useEffect(() => {
    if (buttonTypes?.length > 0) {
      const allTypes = _.uniq(activities.map((activity) => activity.buttonType)).filter((t) => t ? true : false)
      console.log(allTypes)
      const fullTypes = allTypes.map((_btnType) => buttonTypes.find((btnType) => { return btnType.name == _btnType }))
      const newTypes = fullTypes.map((btnType) => { return { name: btnType?.caption ? btnType.caption : 'unknown', value: btnType?.name ? btnType.name : 'unknown' } });
      setFilterButtons(() => [{ value: "all", name: "all" }, ...newTypes])
    }
  }, [buttonTypes])
  return filterButtons;
}

export default function ActivitiesUser() {

  const buttonTypes = useButtonTypes()
  // K pasa se es creado un nuevo post... ? Como se va a mirar? no es un mensaje...
  

  

  // const [buttonPage, setButtonPage] = useState(0)
  const [buttonActivities, setButtonActivities] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [selectedButton, setSelectedButton] = useState(null)

  const filterButtons = updateFilters(buttonTypes, buttonActivities)

  const findActivityDetails = () => {
    if(!selectedActivity)
    {
      return;
    }
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

  usePoolFunc({paused: buttonActivities?.length < 1, timeMs: 10*1000, func:() => findActivityDetails()})
  
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
          <div className="feed-section__left__header">

            <div className="feed-section__title">
              Messages & Alerts
            </div>
            <div className="feed-section__filters">
              {/* <Dropdown options={filterButtons} />
              <Btn
                btnType={BtnType.filter}
                contentAlignment={ContentAlignment.left}
                caption={'test'}
              /> */}
            </div>
          </div>
          <div className="feed-section--activity-content">
            <ActivityList setSelectedActivity={setSelectedActivity} />
          </div>
        </div>
        <ShowDesktopOnly>
          <div className="feed-section__center">
            <ActivityDetail buttonActivities={buttonActivities} button={selectedButton} sendNewMessage={sendNewMessage} closeConversation={closeConversation} selectedActivity={selectedActivity} />
          </div>
        </ShowDesktopOnly>
        <ShowMobileOnly>
          <div className="feed-section__center">
            <ActivityDetail buttonActivities={buttonActivities} button={selectedButton} sendNewMessage={sendNewMessage} closeConversation={closeConversation} selectedActivity={selectedActivity} />
          </div>
        </ShowMobileOnly>
        <div className="feed-section__right">
        </div>
      </div>

    </div>
  );
}