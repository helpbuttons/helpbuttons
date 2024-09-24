import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import router from 'next/router';
import t from 'i18n';
import Btn, {
  BtnType,
  ContentAlignment,
  IconType,
} from 'elements/Btn';
import NetworkLogo from 'components/network/Components';
import NavHeader from 'components/nav/NavHeader'; //just for mobile
import NavLink from 'elements/Navlink';
import {
  IoAddCircle,
  IoAddOutline,
  IoCall,
  IoClose,
  IoGlobeOutline,
  IoHelpOutline,
  IoLogInOutline,
  IoMapOutline,
  IoShare,
} from 'react-icons/io5';
import { setMetadata } from 'services/ServerProps';
import { NextPageContext } from 'next';
import { useEffect, useRef, useState } from 'react';
import AdvancedFilters from 'components/search/AdvancedFilters';
import { useToggle } from 'shared/custom.hooks';
import { TextFormatted } from 'elements/Message';
import { LinkAdminProfile } from 'components/user/LinkAdminProfile';
import { ShowMobileOnly } from 'elements/SizeOnly';
import { ListButtonTypes } from 'components/nav/ButtonTypes';
import getConfig from 'next/config';
import { setSSRLocale } from 'shared/sys.helper';
import { ActivitiesList } from 'layouts/Activity';
import { FindLatestNetworkActivity } from 'state/Networks';
import { InstallButton } from 'components/install';
import { TagsNav } from 'elements/Fields/FieldTags';
import { ShareButtonPopup } from 'components/share';
import { DesktopNotificationsButton } from 'pages/_app';
import { CardSubmenu, CardSubmenuOption } from 'components/card/CardSubmenu';

export default function HomeInfo({ metadata }) {
  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );

  const config = useStore(
    store,
    (state: GlobalState) => state.config,
  );

  const { publicRuntimeConfig } = getConfig();
  const apiUrl = publicRuntimeConfig.apiUrl;

  const currentUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  const [navigatorCoordinates, setNavigatorCoordinates] =
    useState(null);

  const scrollToContact = useRef();
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    store.emit(
      new FindLatestNetworkActivity((latestActivities) => {
        setActivities(() => latestActivities);
      }),
    );
  }, []);
  return (
    <>
      {selectedNetwork && (
        <ShowMobileOnly>
          <div className="homeinfo__search-section">
            <NavHeader
              selectedNetwork={selectedNetwork}
              pageName={'HomeInfo'}
            />
            <AdvancedFilters isHome={true} />
          </div>
        </ShowMobileOnly>
      )}
      {!currentUser && (
        <SupportBanner scrollToContact={scrollToContact} />
      )}
      {selectedNetwork && (
        <div className="homeinfo__container">
          <div className="homeinfo__content">
            {navigatorCoordinates && (
              <div className="homeinfo-card">
                <div className="homeinfo-homeinfo-card__header">
                  <h3 className="homeinfo-homeinfo-card__header-title">
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

            {/* INFO CARD */}
            <div
              className="homeinfo-card homeinfo__card--title-card"
              style={
                {
                  '--network-jumbo': `url('${apiUrl}${selectedNetwork.jumbo}'`,
                } as React.CSSProperties
              }
            >
              <ShowMobileOnly>
                <div className="homeinfo-card__header">
                  <div className="homeinfo__network-title">
                    <div className="avatar-medium--home">
                      <NetworkLogo network={selectedNetwork} />
                    </div>
                    <h3 className="homeinfo__network-title-text">
                      {selectedNetwork.name}
                    </h3>
                  </div>
                </div>
              </ShowMobileOnly>

              <div className="homeinfo-card__section--actions">
                <Btn
                  btnType={BtnType.corporative}
                  contentAlignment={ContentAlignment.center}
                  iconLink={<IoMapOutline />}
                  iconLeft={IconType.svg}
                  extraClass="homeinfo__network-title-card--buttons"
                  caption={t('homeinfo.goToExplore')}
                  onClick={() => router.push('Explore')}
                />
                <Btn
                  btnType={BtnType.corporative}
                  contentAlignment={ContentAlignment.center}
                  iconLeft={IconType.svg}
                  iconLink={<IoAddCircle />}
                  extraClass="homeinfo__network-title-card--buttons"
                  caption={t('homeinfo.goToCreate')}
                  onClick={() => router.push('ButtonNew')}
                />
              </div>
            </div>
            <div className="homeinfo__sections">
              {/*  INFO CARD */}
              <div className="homeinfo-card">
                <div className="homeinfo-card__header">
                  <h3 className="homeinfo-card__header-title">
                    {t('homeinfo.info')}
                  </h3>
                  
                </div>
                <hr></hr>

                <div className="homeinfo__description">
                  {/* <DesktopNotificationsButton/>
                  <InstallButton /> */}

                  <TextFormatted text={selectedNetwork.description} />

                </div>

                <div className="homeinfo-card__section">
                  <InstallButton />
                </div>
                <div className="homeinfo-card__section">
                  <DesktopNotificationsButton/>
                </div>
              </div>

              <div className="homeinfo-card">
                <div className="homeinfo-card__header">
                  <h3 className="homeinfo-card__header-title">
                    {t('homeinfo.activity')}
                  </h3>
                 <ShareButtonPopup />
                </div>
                <hr></hr>
                <div className="homeinfo__description">
                  <ActivitiesList activities={activities} />
                </div>
              </div>

              <div className="homeinfo-card" ref={scrollToContact}>
                <div className="homeinfo-card__header">
                  <h3 className="homeinfo-card__header-title">
                    {t('homeinfo.administeredby')}
                  </h3>
                </div>
                <hr></hr>
                <div className="homeinfo__description">
                  {t('homeinfo.adminInstructions')}
                  <div className="homeinfo__users">
                    {selectedNetwork &&
                      selectedNetwork.administrators &&
                      selectedNetwork.administrators.map(
                        (user, idx) => {
                          return (
                            <LinkAdminProfile user={user} key={idx} />
                          );
                        },
                      )}
                  </div>
                </div>
              </div>

              {/* STATS CARD */}
              <div className="homeinfo-card">
                <div className="homeinfo-card__header">
                  <h3 className="homeinfo-card__header-title">
                    {t('homeinfo.stats')}
                  </h3>
                </div>
                <hr></hr>
                <div className="homeinfo__description">
                  {t('homeinfo.buttons', [
                    selectedNetwork?.buttonCount,
                    config?.userCount.toString(),
                  ])}
                  <div className="homeinfo__hashtags">
                    <ListButtonTypes
                      selectedNetwork={selectedNetwork}
                      pageName={'HomeInfo'}
                    />
                  </div>
                </div>
              </div>

              {/* TOP 10 HASHTAGS CARD OF NETWORK */}
              <div className="homeinfo-card">
                <div className="homeinfo-card__header">
                  <h3 className="homeinfo-card__header-title">
                    {t('homeinfo.popularHashtags')}
                  </h3>
                </div>
                <hr></hr>
                <div className="homeinfo__description">
                  {t('homeinfo.popularHashtagsExplain')}
                </div>
                <div className="homeinfo__hashtags">
                  <TagsNav
                    tags={selectedNetwork.topTags.map(
                      (tag) => tag.tag,
                    )}
                  />
                </div>
              </div>

              {/* HASHTAGS CARD OF NETWORK CONFIGURATION  */}
              {selectedNetwork?.tags &&
                selectedNetwork?.tags.length >= 0 && (
                  <div className="homeinfo-card">
                    <div className="homeinfo-card__header">
                      <h3 className="homeinfo-card__header-title">
                        {t('homeinfo.recommendedHashtags')}
                      </h3>
                    </div>
                    <hr></hr>
                    <div className="homeinfo__hashtags">
                      <TagsNav tags={selectedNetwork.tags} />
                    </div>
                  </div>
                )}

              {/* ACTIONS CARD */}
              <div className="homeinfo-card">
                <div className="homeinfo-card__header">
                  <h3 className="homeinfo-card__header-title">
                    {t('homeinfo.actions')}
                  </h3>
                </div>
                <hr></hr>
                <div className="homeinfo-card__section">
                  <p>{t('homeinfo.exploreSubtitle')}</p>
                  <NavLink href="/Explore">
                    <IoGlobeOutline />
                    <span>{t('menu.explore')}</span>
                  </NavLink>
                </div>
                <div className="homeinfo-card__section">
                  <p>{t('homeinfo.createSubtitle')}</p>
                  <NavLink href="/ButtonNew">
                    <IoAddOutline />
                    <span>{t('menu.create')}</span>
                  </NavLink>
                </div>
                <div className="homeinfo-card__section">
                  <p>{t('homeinfo.faqsSubtitle')}</p>
                  <NavLink href="/Faqs">
                    <IoHelpOutline />
                    <span>{t('menu.faqs')}</span>
                  </NavLink>
                </div>
                {currentUser && (
                  <>
                    <div className="homeinfo-card__section">
                      <p>{t('homeinfo.profileSubtitle')}</p>
                      <NavLink href="/Profile">
                        <IoLogInOutline />
                        <span>{t('menu.profile')}</span>
                      </NavLink>
                    </div>
                  </>
                )}
                {!currentUser && (
                  <div className="homeinfo-card__section">
                    <p>{t('homeinfo.loginSubtitle')}</p>
                    <NavLink href="/Login">
                      <IoLogInOutline />
                      <span>{t('menu.login')}</span>
                    </NavLink>
                  </div>
                )}
                <div className="homeinfo-card__section">
                  <p>{t('homeinfo.createNetwork')}</p>
                  <NavLink href="https://helpbuttons.org">
                    <IoAddOutline />
                    <span>{t('homeinfo.createNetworkButton')}</span>
                  </NavLink>
                </div>
                {/* <div className="homeinfo-card__section">
                        <p>{t('homeinfo.donateSubtitle')}</p>
                          <NavLink href="https://buy.stripe.com/dR68wx3CY17VdFKfZc">
                          <IoCashOutline />
                          <span>{t('menu.donate')}</span>
                        </NavLink>
                      </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SupportBanner({ scrollToContact }) {
  const [showContactDialog, toggleshowContactDialog] =
    useToggle(true);
  return (
    <>
      {showContactDialog && (
        <div className="card-alert__container card-alert__container--bottom">
          <div className="card-alert card-alert--error">
            <>
              <div className="card-alert__content">
                {t('homeinfo.callToAdmin')}
                <Btn
                  btnType={BtnType.circle}
                  iconLink={<IoCall />}
                  iconLeft={IconType.circle}
                  contentAlignment={ContentAlignment.center}
                  onClick={() =>
                    scrollToContact.current.scrollIntoView()
                  }
                />
              </div>

              <Btn
                btnType={BtnType.smallCircle}
                iconLink={<IoClose />}
                iconLeft={IconType.circle}
                contentAlignment={ContentAlignment.center}
                onClick={() => toggleshowContactDialog(false)}
              />
            </>
          </div>
        </div>
      )}
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  setSSRLocale(ctx.locale);
  return setMetadata(t('menu.home'), ctx);
};

function HomeinfoShareOptions({ user }) {
  

  const getOptions = () => {
    
        return (
          <>
            <CardSubmenuOption
              onClick={() => {
                updateRole(user.id, Role.registered);
              }}
              label={t('share.share')}
            />
            <CardSubmenuOption
              onClick={() => {
                updateRole(user.id, Role.registered);
              }}
              label={t('share.embed')}
            />
          </>
        );
      
    }
  

  return <CardSubmenu extraClass="">{getOptions()}</CardSubmenu>;
}