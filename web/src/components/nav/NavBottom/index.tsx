//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import NavLink from 'elements/Navlink';
import {
  IoAdd,
  IoAddCircle,
  IoAddCircleOutline,
  IoAddCircleSharp,
  IoAddOutline,
  IoEnter,
  IoEnterOutline,
  IoGlobe,
  IoGlobeSharp,
  IoHome,
  IoMail,
  IoMailOutline,
  IoPerson,
  IoPersonAdd,
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
import { ShowDesktopOnly, ShowMobileOnly } from 'elements/SizeOnly';
import router from 'next/router';

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
          <ShowMobileOnly>
            {/* {!sessionUser ?
            
            
            : 
            
            } */}
            <NavLink
              href="/" 
              onClick={sessionUser? ()=> router.push(`/ButtonNew`) : () =>
              store.emit(new SetMainPopup(MainPopupPage.LOGIN))
            }
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
          </ShowMobileOnly>
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

            <NavLink
              href="/Activity"
              className={`nav-bottom__link ${isCurrent(
                'Activity',
              )}`}
            >
              <div className="nav-bottom__icon">
                {/* {countUnreadNotifications > 0 && (
                  <span className="notif-circle">
                    {countUnreadNotifications}
                  </span>
                )} */}
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
        <ShowDesktopOnly>
            <NavLink
              href="/" 
              onClick={sessionUser? ()=> router.push(`/ButtonNew`) : () =>
              store.emit(new SetMainPopup(MainPopupPage.LOGIN))
            }
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
          </ShowDesktopOnly>
      </nav>
    </>
  );
}
