import { useRef } from 'store/Store';

import { GlobalState, store } from 'pages';
import router from 'next/router';
import t from 'i18n';
import NetworkLogo from 'components/network/Components';
import { DropDownWhere } from 'elements/Dropdown/DropDownWhere';
import NavLink from 'elements/Navlink';
import {
  IoAddOutline,
  IoGlobeOutline,
  IoHelpOutline,
  IoLogInOutline,
} from 'react-icons/io5';
import { IConfig } from 'services/Setup/config.type';
import { getHostname } from 'shared/sys.helper';
import { NetworkDto } from 'shared/dtos/network.dto';

export default function HomeInfo() {
  const selectedNetwork: NetworkDto = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  const selectedNetworkLoading = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetworkLoading,
  );

  const currentUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );


  const config: IConfig = useRef(
    store,
    (state: GlobalState) => state.config,
  );
  
  return (
    <div className="info-overlay__container">
      <div className="info-overlay__content">
        <form className="info-overlay__location">
          <label className="form__label label">
            {t('homeinfo.start')}
          </label>
          <DropDownWhere placeholder={t('homeinfo.searchlocation')} onSelected={(place) => {
            router.push({
              pathname: '/Explore',
              query: place.geometry,
            });
          }}/>
        </form>
        {selectedNetworkLoading && (
          <>
            <div className="info-overlay__card">Loading...</div>
          </>
        )}
        {selectedNetwork && (
          <>
            <style jsx global>{`
              .info-overlay__container {
                background-image: url(/api/${selectedNetwork.jumbo});
              }
            `}</style>
            <div className="info-overlay__card">
              <div className="card">
                <div className="card__header">
                  <NetworkLogo network={selectedNetwork} />
                  <h3 className="card__header-title">
                    {selectedNetwork.name}
                  </h3>
                </div>
                <div className="info-overlay__description">
                  {selectedNetwork.description}
                </div>
              </div>
              <br />
              <div className="card">
                <div className="card__header">
                  <h3 className="card__header-title">
                    Network Stats
                  </h3>
                </div>
                <div className="info-overlay__description">
                  <div># Buttons {config.buttonCount}</div>
                  <div># Active Users {config.userCount}</div>
                  <div>Administered by:           <NavLink href={`/Profile/${selectedNetwork.administrator.username}`}>
                    <span>{selectedNetwork.administrator.username}@{getHostname()}</span>
                    </NavLink>
                    </div>
                </div>
              </div>
              <br />
              <div className="card">
                <div className="card__header">
                  <h3 className="card__header-title">Actions</h3>
                </div>
                <div>
                  <NavLink
                    href="/Explore"
                    className="nav-bottom__link"
                  >
                    <span>
                      <IoGlobeOutline />
                      {t('menu.explore')}
                    </span>
                  </NavLink>
                  - See & Search the buttons on this map
                </div>
                <div>
                  <NavLink
                    href="/ButtonNew"
                    className="nav-bottom__link"
                  >
                    <span>
                      <IoAddOutline />
                      {t('menu.create')}
                    </span>
                  </NavLink>
                  - Create your buttons and collaborate
                </div>
                <div>
                  <NavLink
                    href="/Explore"
                    className="nav-bottom__link"
                  >
                    <span>
                      <IoHelpOutline />
                      {t('menu.faqs')}
                    </span>
                  </NavLink>
                  - See all the info available about this app
                </div>

                {/* <div>
                  <NavLink
                    href="/Explore"
                    className="nav-bottom__link"
                  >
                    <span>
                      <IoGlobeOutline />
                      {t('menu.explore')}
                    </span>
                  </NavLink>
                  - See & Search the buttons on this map
                </div> */}

                {currentUser && (
                  <>
                  <div>
                    <NavLink
                      href="/Profile"
                      className="nav-bottom__link"
                    >
                      <span>
                        <IoLogInOutline />
                        {t('menu.profile')}
                      </span>
                    </NavLink>
                    - Check your profile
                  </div>
                  </>
                )}
                {!currentUser && (
                  <div>
                    <NavLink
                      href="/Login"
                      className="nav-bottom__link"
                    >
                      <span>
                        <IoLogInOutline />
                        {t('menu.login')}
                      </span>
                    </NavLink>
                    - Enter or create your account!
                  </div>
                )}
              </div>
            </div>

            <div className="info-overlay__card"></div>
          </>
        )}
      </div>
    </div>
  );
}
