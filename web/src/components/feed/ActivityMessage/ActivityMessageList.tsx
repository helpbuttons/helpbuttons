import { ActivityMessageDto } from 'shared/dtos/activity.dto';
import { ActivityMessageCard } from './ActivityMessageCard';
import t from 'i18n';
import { IoChatbox, IoChatbubbleOutline, IoChatbubbles } from 'react-icons/io5';
import { useEffect, useRef } from 'react';
import {
  FindMoreReadMessages,
  FindNewMessages,
  useActivities,
} from 'state/Activity';
import { store } from 'pages';
import Btn from 'elements/Btn';
import Loading from 'components/loading';
import { useScroll } from 'shared/helpers/scroll.helper';

export function ActivityMessageList() {
  const { messages } = useActivities();
  const init = useRef(false);
  useEffect(() => {
    if (!init.current) {
      init.current = true;
      store.emit(new FindNewMessages());
    }
  }, []);

  const scrollLoading = useRef(false);
  const { listEndRef } = useScroll(
    () => {
      if (!scrollLoading.current) {
        scrollLoading.current = true;
        store.emit(new FindMoreReadMessages((messages)=> {
          if(messages.length > 0)
          {
            scrollLoading.current = false;
          }
        }))
      }
    },    
  );

  const markAllAsRead = () => console.log('TODO')
    // store.emit(new ActivityMessagesMarkAllAsRead());

  return (
    <>
      {!(messages || messages.read || messages.unread) && <Loading />}
      {messages && messages.read && messages.unread && (
        <div className="feed__container">
          <div className="feed-section--activity">

            {(messages.unread.length > 0 && false)&&
              <div className="feed__empty-message">
                <Btn
                  caption={t('feed.markMessagesAsRead')}
                  onClick={markAllAsRead}
                ></Btn>
              </div>
            }
            <div className="feed-section--activity-content">
              <div className="feed-section__title">
                <IoChatbubbles />
                {t('feed.unreadMessages')}
              </div>
              {messages.unread &&
                messages.unread.map(
                  (message: ActivityMessageDto, key) => {
                    return (
                      <div className="feed-element" key={key}>
                        <ActivityMessageCard message={message} />
                      </div>
                    );
                  },
                )}
              {(!messages.unread || messages.unread.length < 1) && (
                <div className="feed__empty-message">
                  <div className="feed__empty-message--prev">
                    {t('feed.nounread', ['activities'])}
                  </div>
                </div>
              )}
              <hr />
              <div className="feed-section__title">
                <IoChatbubbles />
                <h2>{t('feed.readMessages')}</h2>
              </div>
              {messages.read && (
                <>
                  {messages.read.map(
                    (message: ActivityMessageDto, key) => {
                      return (
                        <div className="feed-element" key={key}>
                          <ActivityMessageCard message={message} />
                        </div>
                      );
                    },
                  )}
                </>
              )}

              {(!messages.read || messages.read.length < 1) && (
                <div className="feed__empty-message">
                  <div className="feed__empty-message--prev">
                    {t('feed.read', ['activities'])}
                  </div>
                </div>
              )}
              <div ref={listEndRef}>
                {scrollLoading.current && <Loading/>}
              </div>
              <br />
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
