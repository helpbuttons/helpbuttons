import { useStore } from 'state';
import { GlobalState, store } from 'state';
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
  IoInformation,
  IoInformationCircle,
  IoLogInOutline,
  IoMapOutline,
  IoSearchOutline,
  IoShare,
} from 'react-icons/io5';
import { setMetadata } from 'services/ServerProps';
import { NextPageContext } from 'next';
import { useEffect, useRef, useState } from 'react';
import AdvancedFilters from 'components/search/AdvancedFilters';
import { useToggle } from 'shared/custom.hooks';
import { TextFormatted } from 'elements/Message';
import { LinkAdmins } from 'components/user/LinkAdmins';
import { ShowMobileOnly } from 'elements/SizeOnly';
import { ListButtonTypes } from 'components/nav/ButtonTypes';
import getConfig from 'next/config';
import { logoImageUri } from 'shared/sys.helper';
import { FindLatestNetworkActivity } from 'state/Networks';
import { InstallButton } from 'components/install';
import { TagsNav } from 'elements/Fields/FieldTags';
import { ShareButton } from 'components/share';
import {
  CardSubmenu,
  CardSubmenuOption,
} from 'components/card/CardSubmenu';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { DesktopNotificationsButton } from 'components/notifications';
import { useMetadataTitle } from 'state/Metadata';
import { ActivityList } from 'components/feed/Activity/ActivityList';
import { PoweredExtra } from 'components/brand/powered';
import { IsMobilePhone } from 'class-validator';

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
    (state: GlobalState) => state.sessionUser,
  );
  useMetadataTitle(t('menu.home'));

  const scrollToContact = useRef();
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
      {/* {!currentUser && (
        <SupportBanner scrollToContact={scrollToContact} />
      )} */}
      {selectedNetwork && (
        <div className="homeinfo__container">
          <div className="homeinfo__content">
            <NavigatorCoordsButton />


            <div className="homeinfo__sections">
              <HomeInfoNetworkLogo selectedNetwork={selectedNetwork} apiUrl={apiUrl}/>
              <HomeSloganCard selectedNetwork={selectedNetwork} config={config}/>

              <HomeInfoPinnedButtons/>
              {/* <HomeInfoPinnedUsers selectedNetwork={selectedNetwork} config={config}/> */}

              <ShowMobileOnly>
                 <HomeInfoStatsCard selectedNetwork={selectedNetwork} config={config}/>
              </ShowMobileOnly>
              <HomeInfoInfoCard selectedNetwork={selectedNetwork}/>
              <HomeInfoInstallCard selectedNetwork={selectedNetwork}/>
              
              <HomeInfoTopHashTags selectedNetwork={selectedNetwork}/>

              <HomeInfoPinnedHashTags selectedNetwork={selectedNetwork}/>
              <HomeInfoRecentActivity selectedNetwork={selectedNetwork}/>
              
              <HomeInfoAdministeredBy scrollToContact={scrollToContact}/>
              <HomeInfoActionCards currentUser={currentUser}/>

              <HomeInfoFooter/>
              

            </div>
            {/* <div
              className="homeinfo-card homeinfo__card--title-card"
              style={
                {
                  '--network-jumbo': `url('${selectedNetwork.jumbo ? apiUrl+selectedNetwork.jumbo : '/api'+ logoImageUri}'`,
                } as React.CSSProperties
              }
            >
              <div className="homeinfo-card__section--actions"></div>
            </div> */}
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
  };

  return <CardSubmenu extraClass="">{getOptions()}</CardSubmenu>;
}

function NavigatorCoordsButton() {
  const [navigatorCoordinates, setNavigatorCoordinates] =
    useState(null);
  return (<>{navigatorCoordinates && (
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
  )}</>)
}
function HomeInfoNetworkLogo({selectedNetwork, apiUrl}) {

  return (
          <div className="homeinfo-card homeinfo__card--title-card"
            style={
              {
                '--network-jumbo': `url('${selectedNetwork.jumbo ? apiUrl+selectedNetwork.jumbo : '/api'+ logoImageUri}'`,
              } as React.CSSProperties
            }
          >
            <div className="homeinfo-card__header ">
              <div className="homeinfo__network-title">
                <div className="avatar-medium--home">
                  <NetworkLogo network={selectedNetwork} />
                </div>
                <h3 className="homeinfo__network-title-text">
                  {selectedNetwork.name}
                </h3>
              </div>
            </div>
          </div>
  )
}

function HomeSloganCard({selectedNetwork, config}) {
return (<>
              {/* SLOGAN CARD */}
              <div className="homeinfo-card homeinfo__card--slogan-card">
                <div className="homeinfo-card__header homeinfo-card__header--slogan-card">
                  <h3 className="homeinfo-card__header-title">
                  {selectedNetwork.slogan}
                  </h3>
                  <div className="homeinfo-card__controls">
                    <Btn
                      btnType={BtnType.filterCorp}
                      contentAlignment={ContentAlignment.center}
                      iconLeft={IconType.svg}
                      iconLink={<IoAddCircle />}
                      extraClass="homeinfo__network-title-card--buttons"
                      caption={t('homeinfo.goToCreate')}
                      onClick={() => router.push('ButtonNew')}
                    />
                  </div>
                </div><hr></hr>
            
              </div></>)
}

function HomeInfoPinnedButtons() {
  return (<>
    {/*  PINNIED BUTTONS */}
    {false &&
      <div className="homeinfo-card">
        <div className="homeinfo-card__header">
          <h3 className="homeinfo-card__header-title">
            {t('homeinfo.featured')}
          </h3>
        </div>
        <hr></hr>

        <div className="homeinfo-card__section">
          {/* <CardButtonHeadMedium
            button={button}
            buttonType={buttonType}
          /> */}
        </div>
      </div>
    }</>
  )
}

function HomeInfoInfoCard({selectedNetwork})
{
  return (<>{/*  INFO CARD */}
    <div className="homeinfo-card">
      <div className="homeinfo-card__header">
        <h3 className="homeinfo-card__header-title">
        {t('homeinfo.info' , [
             selectedNetwork?.name,
           ])}
        </h3>

        <div className="homeinfo-card__controls">

        </div>
      </div>
      <hr></hr>

      <div className="homeinfo__description">
        <TextFormatted maxChars={600} text={selectedNetwork.description} />
      </div>
      <div className="homeinfo-card__section">
        <div className="homeinfo-card__action-bottom">
          <Btn
            btnType={BtnType.filterCorp}
            contentAlignment={ContentAlignment.center}
            iconLink={<IoInformationCircle />}
            iconLeft={IconType.svg}
            extraClass="homeinfo__network-title-card--buttons"
            caption={t('homeinfo.knowMore')}
            onClick={() => router.push('Faqs')}

          />
        </div>
      </div>
    </div></>)
}


function HomeInfoInstallCard({selectedNetwork})
{
  return (<>{/*  INSTALL CARD */}
    <div className="homeinfo-card">
      <div className="homeinfo-card__header">
        <h3 className="homeinfo-card__header-title">
        {t('homeinfo.install' , [
             selectedNetwork?.name,
           ])}
        </h3>

        <div className="homeinfo-card__controls">

        </div>
      </div>
      <hr></hr>
      <div className="homeinfo-card__section">
        <div className="homeinfo-card__action-bottom">
          <InstallButton />
          <DesktopNotificationsButton />
        </div>
      </div>
    </div></>)
}

function HomeInfoStatsCard({selectedNetwork, config}) {
return (<>
              {/* STATS CARD */}
              <div className="homeinfo-card">
                <div className="homeinfo-card__header">
                  <h3 className="homeinfo-card__header-title">
                    {t('homeinfo.stats' , [
                      selectedNetwork?.name,
                    ])}
                  </h3>
                  <div className="homeinfo-card__controls">
              
                  </div>
                </div><hr></hr>
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
                <div className="homeinfo-card__section">
                  <div className="homeinfo-card__action-bottom">
                    <Btn
                      btnType={BtnType.filterCorp}
                      contentAlignment={ContentAlignment.center}
                      iconLink={<IoSearchOutline />}
                      iconLeft={IconType.svg}
                      extraClass="homeinfo__network-title-card--buttons"
                      caption={t('homeinfo.goToExplore')}
                      onClick={() => router.push('Explore')}
                    />
                  </div>
               </div>
              </div></>)
}

function HomeInfoTopHashTags({selectedNetwork}) {
return (<>
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
              </div></>)
}

function HomeInfoPinnedHashTags({selectedNetwork}) {
  return (<>
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
                    <div className="homeinfo__description">
                    </div>
                    <div className="homeinfo__hashtags">
                      <TagsNav tags={selectedNetwork.tags} />
                    </div>
                  </div>
                )}
  </>)
}


function HomeInfoRecentActivity({selectedNetwork}) {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    if (selectedNetwork) {
      store.emit(
        new FindLatestNetworkActivity((latestActivities) => {
          setActivities(() => latestActivities);
        }),
      );
    }
  }, [selectedNetwork]);
  return (<>
  {/*  RECENT ACTIVITY IN THE APP */}
  <div className="homeinfo-card">
                <div className="homeinfo-card__header">
                  <h3 className="homeinfo-card__header-title">
                    {t('homeinfo.activity')}
                  </h3>
                </div>

                <hr></hr>
                <div className="homeinfo__description">
                  <ActivityList activities={activities} />
                </div>
              </div>
  </>)
}

function HomeInfoAdministeredBy({scrollToContact}) {
  return (<>
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
                    <LinkAdmins />
                  </div>
                </div>
              </div>
  </>)
}

function HomeInfoActionCards({currentUser}) {
  return (<>
  {/* ACTIONS CARD */}
  <div className="homeinfo-card">
                <div className="homeinfo-card__header">
                  <h3 className="homeinfo-card__header-title">
                    {t('homeinfo.actions')}
                  </h3>
                  <div className="homeinfo-card__controls">
                    <ShareButton
                      onClick={() =>
                        store.emit(
                          new SetMainPopup(MainPopupPage.SHARE),
                        )
                      }
                    />
                  </div>
                </div>
                <div className="homeinfo-card__section">
                  <p>{t('homeinfo.exploreSubtitle')}</p>
                  <NavLink href="/Explore">
                    <IoGlobeOutline />
                    <span>{t('menu.explore')}</span>
                  </NavLink>
                </div>
                <div className="homeinfo-card__wrap">
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
  </>)
}

function HomeInfoFooter() {
  return (<>
  <div className="homeinfo-card">
                <div className="homeinfo-card__header">
                  <h3 className="homeinfo-card__header-title"></h3>

                </div>
                <span className="homeinfo-card__section--attr">
                  <PoweredExtra />
                </span>
              </div>
  </>)
}