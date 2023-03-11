//FEED SECTION - HERE COMME ALL THE NOTIFFICATIONS, MESSAGES and CONVERSATION LINKS FROM EXTERNAL RESOURCES
import ButtonPost from 'components/feed/ButtonPost';
import Dropdown from 'elements/Dropdown/DropDown';

export default function Feed({ feed, buttonId }) {
  return (
    <div className="feed-container">
      {/* <div className="feed-selector">
        <Dropdown />
      </div> */}

      <div className="feed-line"></div>

      <div className="feed-section">
        {feed &&
          feed.map((item, idx) => {
            return (
              <div className="feed-element" key={idx}>
                <ButtonPost post={item} buttonId={buttonId} />
              </div>
            );
          })}
      </div>
    </div>
  );
}
