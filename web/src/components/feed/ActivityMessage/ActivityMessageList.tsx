import { ActivityMessageDto } from 'shared/dtos/activity.dto';
import { ActivityMessageCard } from './ActivityMessageCard';
import t from 'i18n';
import { IoChatbox, IoChatbubbleOutline } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityMessagesMarkAllAsRead,
  FindMoreReadMessages,
  FindNewMessages,
  useActivities,
} from 'state/Activity';
import { store } from 'pages';
import Btn from 'elements/Btn';
import Loading from 'components/loading';
import { alertService } from 'services/Alert';

export function useScroll(onLoadMore) {
  const [isVisible, setIsVisible] = useState(false);
  const callbackFunction = (entries) => {
    const [entry] = entries;
    setIsVisible(() => entry.isIntersecting);

    if (isVisible) {
      onLoadMore();
    }
  };
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  };

  const listEndRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      callbackFunction,
      options,
    );
    if (listEndRef.current) observer.observe(listEndRef.current);

    return () => {
      if (listEndRef.current) observer.unobserve(listEndRef.current);
    };
  }, [listEndRef, options]);

  return { listEndRef };
}

export function ActivityMessageList() {
  const { messages } = useActivities();
  const init = useRef(false);
  const scrollLoading = useRef(false);
  useEffect(() => {
    if (!init.current) {
      init.current = true;
      store.emit(new FindNewMessages());
    }
  }, []);

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
            <div className="feed-section__title">
              <IoChatbox />
              {t('feed.unreadMessages')}
            </div>
            {messages.unread.length > 0 &&
              <div className="feed__empty-message">
                <Btn
                  caption={t('feed.markMessagesAsRead')}
                  onClick={markAllAsRead}
                ></Btn>
              </div>
            }
            <div className="feed-section--activity-content">
              {messages.unread &&
                messages.unread.map(
                  (message: ActivityMessageDto, key) => {
                    return (
                      <div className="feed-element" key={key}>
                        <ActivityMessageCard message={message} />
                        <hr />
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
                <IoChatbubbleOutline />
                <h2>{t('feed.readMessages')}</h2>
              </div>
              {messages.read && (
                <>
                  {messages.read.map(
                    (message: ActivityMessageDto, key) => {
                      return (
                        <div className="feed-element" key={key}>
                          <ActivityMessageCard message={message} />
                          <hr />
                        </div>
                      );
                    },
                  )}
                  <div ref={listEndRef}>
                    {scrollLoading.current && <Loading/>}
                  </div>
                </>
              )}

              {(!messages.read || messages.read.length < 1) && (
                <div className="feed__empty-message">
                  <div className="feed__empty-message--prev">
                    {t('feed.read', ['activities'])}
                  </div>
                </div>
              )}
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
