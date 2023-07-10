import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';

import router from 'next/router';
import t from 'i18n';
import Btn, {
  BtnType,
  IconType,
} from 'elements/Btn';
import NetworkLogo from 'components/network/Components';
import NavHeader from 'components/nav/NavHeader'; //just for mobile
import NavLink from 'elements/Navlink';
import {
  IoAddOutline,
  IoGlobeOutline,
  IoHelpOutline,
  IoLogInOutline,
} from 'react-icons/io5';
import NavBottom from 'components/nav/NavBottom';
import SEO from 'components/seo';
import { ServerPropsService } from 'services/ServerProps';
import { NextPageContext } from 'next';
import { SetupSteps } from 'shared/setupSteps';
import {  useState } from 'react';
import { buttonColorStyle, buttonTypes } from 'shared/buttonTypes';
import AdvancedFilters from 'components/search/AdvancedFilters';
import { useToggle } from 'shared/custom.hooks';
import { UpdateFilters } from 'state/Explore';
import Alert from 'components/overlay/Alert';

export default function HomeInfo({
  metadata,
  selectedNetwork,
  config,
}) {
  const [showFiltersForm, toggleShowFiltersForm] = useToggle(false);

  const currentUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  const [navigatorCoordinates, setNavigatorCoordinates] =
    useState(null);

  if(!config)
  {
    return (<Alert>Error getting backend</Alert>)
  }
  
  return (
    <>
      <SEO {...metadata} />
      <div
        style={
          {
            '--network-jumbo': `url('/api/${selectedNetwork.jumbo}'`,
          } as React.CSSProperties
        }
      >
          <div className="info-overlay__search-section">
            <NavHeader
              toggleShowFiltersForm={toggleShowFiltersForm}
              totalNetworkButtonsCount={selectedNetwork.buttonCount}
            />
            <AdvancedFilters
              showFiltersForm={showFiltersForm}
              toggleShowFiltersForm={toggleShowFiltersForm}
              isHome={true}
            />
          </div>
        <div className="info-overlay__container">
          <div className="info-overlay__content">
            <>
              <div className="info-overlay__card">
                {navigatorCoordinates && (
                  <div className="card">
                    <div className="card__header">
                      <h3 className="card__header-title">
                        {t('homeinfo.locationDetected')}
                        <a
                          href={`/Explore?lat=${navigatorCoordinates.latitude}&lng=${navigatorCoordinates.longitude}&zoom=13`}
                        >
                          {t('common.click')}
                        </a>
                      </h3>
                    </div>
                  </div>
                )}
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
                  Explore{selectedNetwork.tags.map((tag) => {
                      return <div className="hashtag">{tag}</div>;
                    })}
                  </div>
                </div>
                <div className="card">
                  <div className="card__header">
                    <h3 className="card__header-title">
                      {t('homeinfo.stats')}
                    </h3>
                  </div>
                  <hr></hr>
                  <div className="info-overlay__description">
                    {t('homeinfo.buttons', [
                      selectedNetwork.buttonCount,
                    ])}
                    <div className="info-overlay__hashtags">
                      {buttonTypes.map((buttonType, idx) => {
                        const buttonTypeFound =
                          selectedNetwork.buttonTypesCount.find(
                            (buttonTypeCount) =>
                              buttonTypeCount.type == buttonType.name,
                          );
                        const buttoTypeCountText =
                          (buttonTypeFound?.count
                            ? buttonTypeFound?.count
                            : 0
                          ).toString() +
                          ' ' +
                          buttonType.caption;
                        return (
                          <div
                            key={idx}
                            style={buttonColorStyle(
                              buttonType.cssColor,
                            )}
                          >
                            <Btn
                              btnType={BtnType.filter}
                              iconLeft={IconType.green}
                              caption={buttoTypeCountText}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      {t('homeinfo.users', [
                        config.userCount.toString(),
                      ])}
                    </div>
                    <div>
                      {t('homeinfo.administeredby')}
                      <NavLink
                        href={`/Profile/${selectedNetwork.administrator.username}`}
                      >
                        <span>
                          {selectedNetwork.administrator.username}@
                          {config.hostname}
                        </span>
                      </NavLink>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card__header">
                    <h3 className="card__header-title">
                      {t('homeinfo.actions')}
                    </h3>
                  </div>
                  <hr></hr>
                  <div className="card__section">
                    <p>{t('homeinfo.exploreSubtitle')}</p>
                    <NavLink href="/Explore">
                      <IoGlobeOutline />
                      <span>{t('menu.explore')}</span>
                    </NavLink>
                  </div>
                  <div className="card__section">
                    <p>{t('homeinfo.createSubtitle')}</p>
                    <NavLink href="/ButtonNew">
                      <IoAddOutline />
                      <span>{t('menu.create')}</span>
                    </NavLink>
                  </div>
                  <div className="card__section">
                    <p>{t('homeinfo.faqsSubtitle')}</p>
                    <NavLink href="/Faqs">
                      <IoHelpOutline />
                      <span>{t('menu.faqs')}</span>
                    </NavLink>
                  </div>
                  {currentUser && (
                    <>
                      <div className="card__section">
                        <p>{t('homeinfo.profileSubtitle')}</p>
                        <NavLink href="/Profile">
                          <IoLogInOutline />
                          <span>{t('menu.profile')}</span>
                        </NavLink>
                      </div>
                    </>
                  )}
                  {!currentUser && (
                    <div className="card__section">
                      <p>{t('homeinfo.loginSubtitle')}</p>
                      <NavLink href="/Login">
                        <IoLogInOutline />
                        <span>{t('menu.login')}</span>
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>

              <div className="info-overlay__card"></div>
            </>
          </div>
        </div>
      </div>
      <NavBottom />
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const serverProps = await ServerPropsService.general('Home', ctx);
    return { props: serverProps };
  } catch (err) {
    console.log(err);
    return {
      props: {
        metadata: null,
        selectedNetwork: null,
        config: null,
        noconfig: true,
      },
    };
  }
};
