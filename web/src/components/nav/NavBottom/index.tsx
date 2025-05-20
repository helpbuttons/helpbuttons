//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import NavLink from 'elements/Navlink';
import {
  IoAddCircle,
  IoAddCircleOutline,
  IoAddCircleSharp,
  IoAddOutline,
  IoPersonAddOutline,
} from 'react-icons/io5';
import { IoPersonOutline } from 'react-icons/io5';
import { IoHeartOutline } from 'react-icons/io5';
import { IoLogInOutline } from 'react-icons/io5';
import { IoGlobeOutline } from 'react-icons/io5';
import { IoHomeOutline } from 'react-icons/io5';
import t from 'i18n';
import { GlobalState, store, useGlobalStore } from 'state';
import { RecenterExplore } from 'state/Explore';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { useActivities } from 'state/Activity';
import { useEffect, useState } from 'react';

export default NavBottom;

function NavBottom({ sessionUser }) {
  // const {unreadActivities, activities} = useActivities()
  const pageName = useGlobalStore((state: GlobalState) => state.homeInfo.pageName)

  const { notifications, messages } = useActivities();
  const [countUnreadNotifications, setCountUnreadNotifications] =
    useState(0);
  const isCurrent = (menuName) => {
    if (pageName && pageName.startsWith(menuName)) {
      return 'nav-bottom__link--current';
    }
    return '';
  };
  useEffect(() => {
    const countMessages = messages?.unread?.length > 0 ?  messages.unread.length : 0;
    const countNotifications = notifications?.unread?.length > 0 ?  notifications.unread.length : 0;
    setCountUnreadNotifications(
      () => countNotifications + countMessages
    );
  }, [notifications, messages]);
  return (
    <>
      <nav id="bottom-nav" className="nav-bottom">
        <NavLink
          href="/HomeInfo"
          className={`nav-bottom__link nav-bottom__link--active ${isCurrent(
            'HomeInfo',
          )}`}
        >
          <div className="nav-bottom__icon">
            <IoHomeOutline />
          </div>
          <div className="nav-bottom__text">{t('menu.home')}</div>
        </NavLink>

        <NavLink
          onClick={(e) => {
            pageName == 'Explore'
              ? store.emit(new RecenterExplore())
              : '';
          }}
          href={'/Explore'}
          className={`nav-bottom__link nav-bottom__link--active ${isCurrent(
            'Explore',
          )}`}
        >
          <div className="nav-bottom__icon">
            <IoGlobeOutline />
          </div>
          <div className="nav-bottom__text">{t('menu.explore')}</div>
        </NavLink>

        <NavLink
          href="/ButtonNew"
          className={`nav-bottom__link nav-bottom__link--create nav-bottom__link--active ${isCurrent(
            'ButtonNew',
          )}`}
        >
          <div className="nav-bottom__icon">
            <svg width="20" height="20" className="icon icon-plus" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18ZM10.75 6.75C10.75 6.33579 10.4142 6 10 6C9.58579 6 9.25 6.33579 9.25 6.75V9.25H6.75C6.33579 9.25 6 9.58579 6 10C6 10.4142 6.33579 10.75 6.75 10.75H9.25V13.25C9.25 13.6642 9.58579 14 10 14C10.4142 14 10.75 13.6642 10.75 13.25V10.75H13.25C13.6642 10.75 14 10.4142 14 10C14 9.58579 13.6642 9.25 13.25 9.25H10.75V6.75Z" />
            </svg>
          </div>
          <div className="nav-bottom__text">{t('menu.create')}</div>
        </NavLink>

        {!sessionUser && (
          <div
            onClick={() =>
              store.emit(new SetMainPopup(MainPopupPage.SIGNUP))
            }
            className={`nav-bottom__link nav-bottom__link--active ${isCurrent(
              'Signup',
            )}`}
          >
            <div className="nav-bottom__icon">
              <IoPersonAddOutline />
            </div>
            <div className="nav-bottom__text">{t('menu.signup')}</div>
          </div>
        )}

        {sessionUser && (
          <>
            <NavLink
              href="/Profile"
              className={`nav-bottom__link nav-bottom__link--active ${isCurrent(
                'Profile',
              )}`}
            >
              <div className="nav-bottom__icon">
                <IoPersonOutline />
              </div>
              <div className="nav-bottom__text">
                {t('menu.profile')}
              </div>
            </NavLink>

            <NavLink
              href="/Activity"
              className={`nav-bottom__link nav-bottom__link--active ${isCurrent(
                'Activity',
              )}`}
            >
              <div className="nav-bottom__icon">
                {countUnreadNotifications > 0 && (
                  <span className="notif-circle">
                    {countUnreadNotifications}
                  </span>
                )}
                <IoHeartOutline />
              </div>

              <div className="nav-bottom__text">
                {t('menu.activity')}
              </div>
            </NavLink>
          </>
        )}

        {!sessionUser && (
          <div
            onClick={() =>
              store.emit(new SetMainPopup(MainPopupPage.LOGIN))
            }
            className={`nav-bottom__link nav-bottom__link--active ${isCurrent(
              'Login',
            )}`}
          >
            <div className="nav-bottom__icon">
              <IoLogInOutline />
            </div>
            <div className="nav-bottom__text">{t('menu.login')}</div>
          </div>
        )}
      </nav>
    </>
  );
}
