//FEED SECTION - HERE COMME ALL THE NOTIFFICATIONS, MESSAGES and CONVERSATION LINKS FROM EXTERNAL RESOURCES
import DebugToJSON from 'elements/Debug';
import Dropdown from 'elements/Dropdown/DropDown';
import CardNotification from '../../components/feed/CardNotification'

export default function FeedProfile({activities}) {
  return (

    <div className="feed-container">

      {/* <div className="feed-selector">

          <Dropdown/>

      </div> */}
      <div className="feed-line"></div>

      <div className="feed-section">

        {activities.map((activity) => {
          return (
          <div className="feed-element">
            <CardNotification activity={activity}/>
          </div>)
        })}
        
      </div>

    </div>

  );
}
