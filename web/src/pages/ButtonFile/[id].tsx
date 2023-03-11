//the button url itself

import CardButton from 'components/button/CardButton';

import Feed from 'layouts/Feed';
import t from 'i18n';
import router from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from 'shared/entities/button.entity';
import { GlobalState, store } from 'pages';
import { FindButton, SetAsCurrentButton } from 'state/Explore';
import { alertService } from 'services/Alert';
import { useRef } from 'store/Store';
import PostNew from 'components/feed/PostNew';
import DebugToJSON from 'elements/Debug';

export default function ButtonFile() {
  const id = router.query.id;
  // get from the store!!
  // const [button, setButton] = useState<Button>(null);
  // FeedButton
  // const [feed, setFeed] = useState<any>(null);
  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  const currentButton: Button = useRef(
    store,
    (state: GlobalState) => state.explore.currentButton,
  );

  useEffect(() => {
    if (id !== null) {
      store.emit(new SetAsCurrentButton(id));
      store.emit(
        new FindButton(
          id,
          () => {
            console.log('button loaded');
          },
          (errorMessage) => {
            alertService.error(errorMessage);
          },
        ),
      );
    }
    // if (!feed && currentButton) {
    //   const singleFeedItem = {
    //     author: currentButton.owner,
    //     message: 'my message',
    //     created: '2023-03-02T18:40:24.126Z',
    //     modified: Date(),
    //     comments: [
    //       {
    //         author: currentButton.owner,
    //         message: 'comment from someone',
    //         created: Date(),
    //         modified: Date(),
    //       },
    //       {
    //         author: currentButton.owner,
    //         message: 'comment from someone',
    //         created: Date(),
    //         modified: Date(),
    //       },
    //     ],
    //     reactions: [
    //       {
    //         ':like:': 10,
    //         ':heart:': 5,
    //       },
    //     ],
    //   };
    //   const feed = [singleFeedItem, singleFeedItem, singleFeedItem];
    //   setFeed(feed);
    // }
  }, [id, currentButton]);

  return (
    <>
      {currentButton && (
        
        <>
          <div className="body__content">
            <div className="body__section">
            <DebugToJSON data={currentButton}/>
              <CardButton button={currentButton} />

              {loggedInUser && 
              <div className="button-file__action-section">
                <div className="button-file__action-section--field">
                  <PostNew buttonId={currentButton.id} />
                </div>
              </div>
              }
              {currentButton && (
                <>
                <Feed feed={currentButton.feed} buttonId={currentButton.id} />
                <Feed feed={currentButton.feed} buttonId={currentButton.id} />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
