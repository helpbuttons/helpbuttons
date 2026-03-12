import Feed from 'layouts/Feed';
import CardButton from '../CardButton';
import { useToggle } from 'shared/custom.hooks';
import { useGlobalStore } from 'state';
import { GlobalState, store } from 'state';
import { useButtonTypes } from 'shared/buttonTypes';
import Loading from 'components/loading';
import { useEffect } from 'react';
import { FindButton, NextCurrentButton, PreviousCurrentButton, updateCurrentButton } from 'state/Explore';
import { useSwipeable } from 'react-swipeable';
import Footer from 'components/footer';


export function ButtonShow({button, hideSendPrivateMessage = false, hideFooter = false}) {
  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      // if(eventData.dir == "Left")
      // {
      //   store.emit(new NextCurrentButton())
      // }
      // if(eventData.dir == "Right")
      // {
      //   store.emit(new PreviousCurrentButton())
      // }
    }
  });
  const [showReplyFirstPost, toggleShowReplyFirstPost] =  useToggle(false);
  const [isPrivateMessage, setPrivateMessage] = useToggle(false);

  const buttonTypes = useButtonTypes();

  return (
     <div className='card-button__wrapper' {...handlers}> 
      {button && buttonTypes && (
        <>
          <CardButton
            button={button}
            buttonTypes={buttonTypes}
            showReplyFirstPost={showReplyFirstPost}
            toggleShowReplyFirstPost={toggleShowReplyFirstPost}
            hideSendPrivateMessage={hideSendPrivateMessage}
          />
          <Feed 
            button={button}
            showReplyFirstPost={showReplyFirstPost}
            isprivateMessage={isPrivateMessage}
            toggleShowReplyFirstPost={toggleShowReplyFirstPost}
            hideSendPrivateMessage={hideSendPrivateMessage}
          />
          {!hideFooter && <Footer />}
        </>
      )}
      {!(button && buttonTypes) && <Loading />}
      </div>
  );
}

