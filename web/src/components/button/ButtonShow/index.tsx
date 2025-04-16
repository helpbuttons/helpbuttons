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


export function ButtonShow({button}) {
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
  const buttonTypes = useButtonTypes();

  return (
     <div {...handlers}> 
      {button && buttonTypes && (
        <>
          <CardButton
            button={button}
            buttonTypes={buttonTypes}
            showReplyFirstPost={showReplyFirstPost}
            toggleShowReplyFirstPost={toggleShowReplyFirstPost}
          />
          <Feed 
            button={button}
            showReplyFirstPost={showReplyFirstPost}
            toggleShowReplyFirstPost={toggleShowReplyFirstPost}
          />
        </>
      )}
      {!(button && buttonTypes) && <Loading />}
      </div>
  );
}

