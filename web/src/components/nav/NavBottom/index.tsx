//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import NavLink from 'elements/Navlink';
import {
  IoAddCircle,
  IoAddCircleOutline,
  IoEnter,
  IoEnterOutline,
  IoGlobeSharp,
  IoHome,
  IoMail,
  IoMailOutline,
  IoPerson,
  IoPersonAdd,
  IoPersonAddOutline,
} from 'react-icons/io5';
import { IoPersonOutline } from 'react-icons/io5';
import { IoGlobeOutline } from 'react-icons/io5';
import { IoHomeOutline } from 'react-icons/io5';
import t from 'i18n';
import { GlobalState, store, useGlobalStore } from 'state';
import { RecenterExplore } from 'state/Explore';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { useEffect, useState } from 'react';
import { ShowDesktopOnly, ShowMobileOnly } from 'elements/SizeOnly';
import router from 'next/router';

export default NavBottom;

function NavBottom({ sessionUser, isScrollingUp }) {
  const activities = useGlobalStore((state: GlobalState) => state.activities.buttons)
  const pageName = useGlobalStore((state: GlobalState) => state.homeInfo.pageName)
  
  const [countUnreadNotifications, setCountUnreadNotifications] =
    useState(0);
  const isCurrent = (menuName) => {
    if (pageName && pageName.startsWith(menuName)) {
      return 'nav-bottom__link--current';
    }
    return '';
  };
  useEffect(() => {
    const countUnread = activities.reduce((countUnread, activity) => { 
      if (activity.read == false) { 
        return countUnread + 1 
      } 
      return countUnread 
    }, 0)
    setCountUnreadNotifications(
      () => countUnread
    );
  }, [activities]);
  return (
    <>
      <nav id="bottom-nav" className={isScrollingUp ? "nav-bottom " : "nav-bottom nav-bottom--hide"}>
        <NavLink
          href="/HomeInfo"
          className={`nav-bottom__link ${isCurrent(
            'HomeInfo',
          )}`}
        >
          <div className="nav-bottom__icon">
                {isCurrent(
                    'HomeInfo',
                  ) ?  
                    <IoHome/>
                  :
                    <IoHomeOutline/>
                }
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
          className={`nav-bottom__link ${isCurrent(
            'Explore',
          )}`}
        >
          <div className="nav-bottom__icon">
                {isCurrent(
                    'Explore',
                  ) ?  
                    <IoGlobeSharp/>
                  :
                    <IoGlobeOutline/>
                }
          </div>
          <div className="nav-bottom__text">{t('menu.explore')}</div>
        </NavLink>
            <NavLink
              href="#"
              onClick={(e) => {
                if(!sessionUser){
                  store.emit(new SetMainPopup(MainPopupPage.LOGIN))
                }else{
                  router.push('/ButtonNew')
                }
              }}
              className={`nav-bottom__link nav-bottom__link--create ${isCurrent(
                'ButtonNew',
              )}`}
            >
              <div className="nav-bottom__icon">
                {isCurrent(
                    'ButtonNew',
                  ) ?  
                    <IoAddCircle/>
                  :
                    <IoAddCircleOutline/>
                }
              </div>
              <div className="nav-bottom__text">{t('menu.create')}</div>
            </NavLink>
        {!sessionUser && (
          <div
            onClick={() =>
              store.emit(new SetMainPopup(MainPopupPage.SIGNUP))
            }
            className={`nav-bottom__link ${isCurrent(
              'Signup',
            )}`}
          >
            <div className="nav-bottom__icon">
                {isCurrent(
                    'Signup',
                  ) ?  
                    <IoPersonAdd/>
                  :
                    <IoPersonAddOutline/>
                }
            </div>
            <div className="nav-bottom__text">{t('menu.signup')}</div>
          </div>
        )}

        {sessionUser && (
          <>
            

            <NavLink
              href="/Activity"
              className={`nav-bottom__link ${isCurrent(
                'Activity',
              )}`}
            >
              <div className="nav-bottom__icon">
                { countUnreadNotifications > 0 && (
                  <span className="notif-circle">
                    {countUnreadNotifications} 
                  </span>
                )}
                {isCurrent(
                    'Activity',
                  ) ?  
                    <IoMail/>
                  :
                    <IoMailOutline/>
                  }
              </div>

              <div className="nav-bottom__text">
                {t('menu.activity')}
              </div>
            </NavLink>

            <NavLink
              href="/Profile"
              className={`nav-bottom__link ${isCurrent(
                'Profile',
              )}`}
            >
              <div className="nav-bottom__icon">
                 {isCurrent(
                    'Profile',
                  ) ? 
                      <IoPerson/>
                    :
                      <IoPersonOutline/>
                  }
              </div>
              <div className="nav-bottom__text">
                {t('menu.profile')}
              </div>
            </NavLink>
          </>
        )}

        {!sessionUser && (
          <div
            onClick={() =>
              store.emit(new SetMainPopup(MainPopupPage.LOGIN))
            }
            className={`nav-bottom__link ${isCurrent(
              'Login',
            )}`}
          >
              <div className="nav-bottom__icon">
                  {isCurrent(
                    'Login',
                  ) ? 
                    <IoEnter/>
                  :
                    <IoEnterOutline/>
                  }
              </div>
            <div className="nav-bottom__text">{t('menu.login')}</div>
          </div>
        )}
    
      </nav>
    </>
  );
}
