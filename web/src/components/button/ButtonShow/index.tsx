import Feed from 'layouts/Feed';
import CardButton from '../CardButton';
import { useToggle } from 'shared/custom.hooks';
import { useGlobalStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { useButtonTypes } from 'shared/buttonTypes';
import Loading from 'components/loading';
import { useEffect } from 'react';
import { FindButton, NextCurrentButton, PreviousCurrentButton, updateCurrentButton } from 'state/Explore';
import { useSwipeable } from 'react-swipeable';


export function ButtonShow({button}) {
  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if(eventData.dir == "Left")
      {
        store.emit(new NextCurrentButton())
      }
      if(eventData.dir == "Right")
      {
        store.emit(new PreviousCurrentButton())
      }
    }
  });

  useEffect(() => {
    if(button)
    {
      window.history.replaceState(null, '', `/Explore?btn=${button.id}`);
    }
    
  }, [button]);
  const buttonTypes = useButtonTypes();
  return (
     <div {...handlers}> 
      {button && buttonTypes && (
        <>
          <CardButton
            button={button}
            buttonTypes={buttonTypes}
          />
          <Feed button={button} />
        </>
      )}
      {!(button && buttonTypes) && <Loading />}
      </div>
  );
}

export const useSetButtonFromUrl = () => {
  const url = new URL(window.location.href);

  const params = new URLSearchParams(url.search);
  const btnId = params.get('btn');

  if (btnId) {
    store.emit(
      new FindButton(btnId, (buttonFetched) => {
        store.emit(new updateCurrentButton(buttonFetched));
      }),
    );
  }
};
