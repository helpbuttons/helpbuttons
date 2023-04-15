import { useRef } from 'store/Store';

import { GlobalState, store } from 'pages';
import router from 'next/router';
import t from 'i18n';
import NetworkLogo from 'components/network/Components';
import NavLink from 'elements/Navlink';
import {
  IoAddOutline,
  IoGlobeOutline,
  IoHelpOutline,
  IoLogInOutline,
} from 'react-icons/io5';
import { getHostname } from 'shared/sys.helper';
import { NetworkDto } from 'shared/dtos/network.dto';
import { SetupDto } from 'shared/entities/setup.entity';
import DropDownSearchLocation from 'elements/DropDownSearchLocation';
import { useEffect, useState } from 'react';
import { updateExploreMapZoom, updateMapCenter } from 'state/Explore';

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

  const config: SetupDto = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  const [navigatorCoordinates, setNavigatorCoordinates] = useState(null)
  
  useEffect(() => {
    if(navigator)
    {
    navigator.geolocation.getCurrentPosition(function(position) {
      setNavigatorCoordinates(position.coords)
    });
  }
  }, [navigator])
  
  const handleSelectedPlace = (place) => {
    router.push({
      pathname: '/Explore',
      query: place.geometry,
    });
  };

  return (
    <>
    {selectedNetwork && (
      <div style={{ "--network-jumbo": `url('/api/${selectedNetwork.jumbo}'` } as React.CSSProperties}>
    <div className="info-overlay__container">
      <div className="info-overlay__content">
        <form className="info-overlay__search-section">
          <label className="form__label label">
            {t('homeinfo.start')}
          </label>
          <DropDownSearchLocation
          placeholder={t('homeinfo.searchlocation')}
          handleSelectedPlace={handleSelectedPlace}
          />
        </form>
        {selectedNetworkLoading && (
          <>
            <div className="info-overlay__card">Loading...</div>
          </>
        )}
        
          <>
           
            <div className="info-overlay__card">
              {navigatorCoordinates && 
              <div className="card">
                <div className="card__header">
                  <h3 className="card__header-title">Do you want to navigate to check buttons in your region? <a href={`/Explore?lat=${navigatorCoordinates.latitude}&lng=${navigatorCoordinates.longitude}&zoom=13`}>Click here</a></h3>
                </div>
              </div>
              }
              <div className="card">
                <div className="card__header">
                  <div className="avatar-medium">
                    <NetworkLogo network={selectedNetwork} />
                  </div>
                  <h3 className="card__header-title network-title">
                    {selectedNetwork.name}
                  </h3>
                </div>
                <div className="info-overlay__description">
                  {selectedNetwork.description}
                </div>
                <div className="info-overlay__hashtags">
                  {selectedNetwork.tags.map((tag) => {return (
                    <div className="hashtag">{tag}</div>)})
                  }
                </div>
              </div>
              <div className="card">
                <div className="card__header">
                  <h3 className="card__header-title">
                    Network Stats
                  </h3>
                </div>
                <div className="info-overlay__description">
                  <div># Buttons {config.buttonCount}</div>
                  <div># Active Users {config.userCount}</div>
                  <div>
                    Administered by:
                    <NavLink
                      href={`/Profile/${selectedNetwork.administrator.username}`}
                    >
                      <span>
                        {selectedNetwork.administrator.username}@
                        {getHostname()}
                      </span>
                    </NavLink>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="card__header">
                  <h3 className="card__header-title">Actions</h3>
                </div>
                <div>
                  <NavLink href="/Explore">
                    <span>
                      <IoGlobeOutline />
                      {t('menu.explore')}
                    </span>
                  </NavLink>
                  - See & Search the buttons on this map
                </div>
                <div>
                  <NavLink href="/ButtonNew">
                    <span>
                      <IoAddOutline />
                      {t('menu.create')}
                    </span>
                  </NavLink>
                  - Create your buttons and collaborate
                </div>
                <div>
                  <NavLink href="/Explore">
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
                      <NavLink href="/Profile">
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
                    <NavLink href="/Login">
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
        
      </div>
    </div></div>)}</>
  );
}
