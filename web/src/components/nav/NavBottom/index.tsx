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
import { store } from 'pages';
import { RecenterExplore } from 'state/Explore';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { useActivities } from 'state/Activity';
import { useEffect, useState } from 'react';

export default NavBottom;

function NavBottom({ loggedInUser, pageName }) {
  // const {unreadActivities, activities} = useActivities()
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
            <IoAddCircleOutline />
          </div>
          <div className="nav-bottom__text">{t('menu.create')}</div>
        </NavLink>

        {!loggedInUser && (
          <div
            // href="/Signup"
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

        {loggedInUser && (
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

        {!loggedInUser && (
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
