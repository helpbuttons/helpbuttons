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
  const demoActivities = [{
    "id": "7fe7892910594a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.Message,
    "read": true,
    "createdAt": new Date("Wed Nov 05 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": "Hola tienes todavía el kilo de alimentos que ofrecías",
    "footer": "Laranjas al kilo - Calle Juan, Madrid",
    "from": "Manuel",
    "title": "Manuel",
    "image": "/files/get/e44e58be7ffc4325a2cbb6f939f736c99f82.jpeg",
    // if is owner of the button, show the user image, if not show the button image
    "buttonType": "offer",
    "type": "Message" // Comment
  },
  {
    "id": "7fe7892910594a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.Message,
    "read": false,
    "createdAt": new Date("Wed Nov 05 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": "Hola tienes todavía el kilo de alimentos que ofrecías",
    "footer": "Laranjas al kilo - Calle Juan, Madrid",
    "from": "",
    "title": "Manuel",
    "image": "/files/get/e44e58be7ffc4325a2cbb6f939f736c99f82.jpeg",
    "buttonType": "offer",
    "type": "Message" // Comment
  },
  {
    "id": "7fe7892910594a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.Message,
    "read": false,
    "createdAt": new Date("Wed Nov 05 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": "Buscamos un fornecedor de kiwis",
    "premessage": "Manuel: ",
    "footer": "",
    "from": "Manuel",
    "title": "Community & support",
    "image": "/files/get/e44e58be7ffc4325a2cbb6f939f736c99f82.jpeg",
    "buttonType": "offer",
    "type": "Message" // Comment
  },
  {
    "id": "7fe7892910594a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.Message,
    "read": false,
    "createdAt": new Date("Wed Nov 05 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "premessage": "Manuel: ",
    "message": "Este Luis es muy peligroso pa la red",
    "footer": "",
    "from": "Manuel",
    "title": "Coordinators",
    "image": "/files/get/e44e58be7ffc4325a2cbb6f939f736c99f82.jpeg",
    "buttonType": "offer",
    "type": "Message" // Comment
  },
  {
    "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.DeleteButton,
    "read": true,
    "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": t("_helpbutton_ was deleted"),
    "footer": "Lemons al kilo - Calle Juan, Madrid",
    "from": "",
    "image": "",
    "buttonType": "need",
    "type": "Notice",
    "title": "Manuel"
  },
  // we dont publish new button!
  // {
  //   "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
  //   "eventName": ActivityEventName.NewButton,
  //   "read": true,
  //   "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
  //   "message": "new button created",
  //   "subtitle": "",
  //   "from": "",
  //   "image": "",
  //   "buttonType": "need",
  //   "type": ""
  // },
  {
    "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.NewPost,
    "read": true,
    "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": "new post created 'Tenemos mas manzanas disponibles'",
    "footer": "Venda de vegetales - Calle del Jose, Barcelona", // title of buttton
    "from": "",
    "title": "Manuel",
    "image": "",
    "buttonType": "need",
    "type": "Notice",
    "link": "/ShowPost?id=82719321"
  },
  {
    "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.NewPostComment,
    "read": true,
    "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": "comented on your button 'Esta oferta no es cierta, esta persona no es de fiar....'",
    "footer": "Animal perdido en la calle - Madrid",
    "title": "Maria", // the person that wrote the comment
    "image": "",
    "buttonType": "need",
    "type": "Notice",
    "link": "/LinkToOpenPostComment"
  },
  {
    "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.NewFollowingButton,
    "read": true,
    "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": t("Followed your _helpbutton_"),
    "title": "Margarida",
    "from": "",
    "image": "",
    "buttonType": "need",
    "type": "Notice",
    "footer": "Animal perdido en la calle - Madrid",
  },
  {
    "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    "eventName": ActivityEventName.NewFollowingButton,
    "read": true,
    "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    "message": t("You started following"),
    "title": "",
    "from": "",
    "image": "",
    "buttonType": "need",
    "type": "Notice",
    "footer": "Animal perdido en la calle - Madrid",
  },
    // {
    //   "id": "7fe789291059d4a2588cb7e2f221d82cc3ccb",
    //   "eventName": ActivityEventName.ExpiredButton,
    //   "read": true,
    //   "createdAt": new Date("Wed Nov 01 2025 10:53:30 GMT+0000 (Greenwich Mean Time)"),
    //   "message": "new button created",
    //   "subtitle": "",
    //   "from": "",
    //   "image": "",
    //   "buttonType": "need",
    //   "type": ""
    // }
  ]

  const filterButtons = updateFilters(buttonTypes, demoActivities)

  // const [buttonPage, setButtonPage] = useState(0)
  const [buttonActivities, setButtonActivities] = useState(demoActivities)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [selectedButton, setSelectedButton] = useState(null)

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
            <ActivityList setSelectedActivity={setSelectedActivity} demoActivities={demoActivities} />
          </div>
        </div>
        <div className="feed-section__center">
          <ActivityDetail buttonActivities={buttonActivities} button={selectedButton} sendNewMessage={sendNewMessage} closeConversation={closeConversation} selectedActivity={selectedActivity} />
        </div>
        <div className="feed-section__right">
        </div>
      </div>

    </div>
  );
}