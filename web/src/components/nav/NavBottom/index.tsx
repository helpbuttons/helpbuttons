//Mobile bottom navigation component with just creation , profile and home buttons if logged in. It not logged it shows home, Button creation , login and faqs too.
import NavLink from 'elements/Navlink';
import { IoAddOutline, IoPersonAddOutline } from 'react-icons/io5';
import { IoPersonOutline } from 'react-icons/io5';
import { IoHeartOutline } from 'react-icons/io5';
import { IoLogInOutline } from 'react-icons/io5';
import { IoGlobeOutline } from 'react-icons/io5';
import { IoHomeOutline } from 'react-icons/io5';
import t from 'i18n';
import { GlobalState, store } from 'pages';
import { useStore } from 'store/Store';
import { RecenterExplore } from 'state/Explore';
import { EnteringPickerMode, SetEnteringMode } from 'state/HomeInfo';

export default NavBottom;

function NavBottom({loggedInUser, pageName}) {
  const activities = useStore(
    store,
    (state: GlobalState) => state.activities,
  );
  const unreadActivities = useStore(
    store,
    (state: GlobalState) => state.unreadActivities,
  );

  // const router = useRouter();
  // const path = router.asPath.split('?')[0];
  // const pageName = path.split('/')[1];
  const isCurrent = (menuName) => {
    if (pageName && pageName.startsWith(menuName)) {
      return 'nav-bottom__link--current';
    }
    return '';
  };
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
              (pageName == 'Explore'? store.emit(new RecenterExplore()) : '')}}
            href={"/Explore"}
            className={`nav-bottom__link nav-bottom__link--active ${isCurrent(
              'Explore',
            )}`}
          >
            <div className="nav-bottom__icon">
              <IoGlobeOutline />
            </div>
            <div className="nav-bottom__text">
              {t('menu.explore')}
            </div>
          </NavLink>

          <NavLink
            href="/ButtonNew"
            className={`nav-bottom__link nav-bottom__link--create nav-bottom__link--active ${isCurrent(
              'ButtonNew',
            )}`}
          >
            <div className="nav-bottom__icon">
              <IoAddOutline />
            </div>
            <div className="nav-bottom__text">{t('menu.create')}</div>
          </NavLink>

          {!loggedInUser && (
            <div
              // href="/Signup"
              onClick={() => store.emit(new SetEnteringMode(EnteringPickerMode.SIGNUP))}
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
                  {unreadActivities > 0 && (
                    <span className="notif-circle">
                      {unreadActivities}
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
              onClick={() => store.emit(new SetEnteringMode(EnteringPickerMode.LOGIN))}
              className={`nav-bottom__link nav-bottom__link--active ${isCurrent(
                'Login',
              )}`}
            >
              <div className="nav-bottom__icon">
                <IoLogInOutline />
              </div>
              <div className="nav-bottom__text">
                {t('menu.login')}
              </div>
            </div>
          )}
        </nav>
    </>
  );
}
