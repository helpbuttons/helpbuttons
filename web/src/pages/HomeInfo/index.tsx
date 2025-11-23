import { useGlobalStore, useStore } from 'state';
import { GlobalState, store } from 'state';
import router from 'next/router';
import t from 'i18n';
import Btn, {
  BtnCaption,
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
  IoArrowBackCircle,
  IoArrowBackSharp,
  IoArrowDownCircle,
  IoArrowDownCircleOutline,
  IoArrowDownSharp,
  IoArrowUpSharp,
  IoCall,
  IoClose,
  IoDownload,
  IoDownloadOutline,
  IoEaselSharp,
  IoGlobeOutline,
  IoHelpOutline,
  IoInformation,
  IoInformationCircle,
  IoLocateOutline,
  IoLogInOutline,
  IoLogoWebComponent,
  IoMapOutline,
  IoPersonAddOutline,
  IoPulseOutline,
  IoStatsChart,
  IoTrophySharp,
  IoVideocamOutline,
} from 'react-icons/io5';
import { setMetadata } from 'services/ServerProps';
import { NextPageContext } from 'next';
import { useEffect, useRef, useState } from 'react';
import AdvancedFilters from 'components/search/AdvancedFilters';
import { useToggle } from 'shared/custom.hooks';
import { TextFormatted } from 'elements/Message';
import { LinkAdmins } from 'components/user/LinkAdmins';
import { ShowDesktopOnly, ShowMobileOnly } from 'elements/SizeOnly';
import {  ListButtonTypes } from 'components/nav/ButtonTypes';
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
import HomeInfoPinnedButtons from 'components/home/Pinned';
import { ListKeyLocation } from 'state/Geo';
import Footer from 'components/footer';

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
            />
            <AdvancedFilters isHome={true} />
          </div>
        </ShowMobileOnly>
      )}

      {/* 
      Make this optional
      https://github.com/helpbuttons/helpbuttons/issues/1057
      {!currentUser && (
        <SupportBanner scrollToContact={scrollToContact} />
      )} */}
      {selectedNetwork && (
        <>
        <div className="homeinfo__container">
          <div className="homeinfo__content">
            <NavigatorCoordsButton />


            <div className="homeinfo__sections">
              
              <HomeInfoNetworkLogo selectedNetwork={selectedNetwork} />
              <HomeSloganCard selectedNetwork={selectedNetwork} config={config} />

              <HomeInfoPinnedButtons />
              
              <HomeInfoStatsCard selectedNetwork={selectedNetwork} config={config} />

              <HomeInfoInfoCard selectedNetwork={selectedNetwork} />

              <HomeInfoKeyLocations selectedNetwork={selectedNetwork} />
              <HomeInfoInstallCard selectedNetwork={selectedNetwork} />

              <HomeInfoRecentActivity selectedNetwork={selectedNetwork} />
              
              <HomeInfoTopHashTags selectedNetwork={selectedNetwork} />
              <HomeInfoPinnedHashTags selectedNetwork={selectedNetwork} />

              <HomeInfoAdministeredBy scrollToContact={scrollToContact} />
              {/* <HomeInfoActionCards currentUser={currentUser} /> */}

            </div>
            <div
              className="homeinfo-card homeinfo__card--title-card"
              style={
                {
                  '--network-jumbo': `url('${selectedNetwork.jumbo ? apiUrl + selectedNetwork.jumbo : '/api' + logoImageUri}'`,
                } as React.CSSProperties
              }
            >
              <div className="homeinfo-card__section--actions"></div>
            </div>
          </div>
                              <Footer/>

        </div>
                  </>

      )}
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('menu.home'), ctx);
};

function NavigatorCoordsButton() {
  const [navigatorCoordinates, setNavigatorCoordinates] =
    useState(null);
  return (<>{navigatorCoordinates && (
    <div className="homeinfo-card">
      <div className="homeinfo-card__header">
        <h3 className="homeinfo-card__header-title">
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

function HomeInfoNetworkLogo({ selectedNetwork }) {
  return (

        <div className="homeinfo__network-title">
          <div className="avatar-medium--home">
            <NetworkLogo network={selectedNetwork} />
          </div>
          <h3 className="homeinfo__network-title-text">
            {selectedNetwork.name}
          </h3>
      </div>
  )
}


function HomeInfoInfoCard({ selectedNetwork }) {
  const [showInfo, toggleShowInfo] =
    useToggle(false);
  const [description, setDescription] = useState('...')

  const trimCharactersRemoveLastIncompleteWord = (description, maxLength) => {
    var trimmedString = description.substr(0, maxLength);
    return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
  }
  
  useEffect(() =>{
    if (selectedNetwork)
    {
      setDescription(() => {
        return trimCharactersRemoveLastIncompleteWord(selectedNetwork.description, 100)
      })
    }
  },[])
  return (<>
  {/*  INFO CARD */}
    <div className={(showInfo ? "homeinfo-card--opened ":" ") + " homeinfo-card homeinfo-card--network-description"}>
        <div className="homeinfo-card__header homeinfo-card__header--openable" onClick={toggleShowInfo}>
                <h3 className="homeinfo-card__header-title" >
                    {t('homeinfo.knowMore',[selectedNetwork.name])}
                </h3>
                <div className="homeinfo-card__controls homeinfo-card__controls--openable">
                  <Btn
                    btnType={BtnType.corporative}
                    iconLink={showInfo ? <IoArrowBackSharp/> : <IoInformation/>}
                    iconLeft={IconType.circle}
                    contentAlignment={ContentAlignment.center}
                  />
                </div>
        </div>
        <div className="homeinfo__description homeinfo__description--openable">
          <TextFormatted text={selectedNetwork.description} />
          <HomeFAQButton/>
        </div>
    </div></>
    )
}

function HomeFAQButton() {
  return (

    <Btn
      btnType={BtnType.filterCorp}
      contentAlignment={ContentAlignment.center}
      iconLink={<IoHelpOutline />}
      iconLeft={IconType.svg}
      extraClass="homeinfo__network-title-card--buttons"
      caption={t('faqs.title')}
      onClick={() => router.push('Faqs')}
    />
  )
}

function HomeInfoStatsCard({ selectedNetwork, config }) {
  return (<>
    {/* STATS CARD */}
    <div className="homeinfo-card">
      <div className="homeinfo-card__header">
        <h3 className="homeinfo-card__header-title">
          <IoEaselSharp/>
          {t('homeinfo.stats', [selectedNetwork.name])}
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
          <ListButtonTypes/>
        </div>
      </div>
    </div></>)
}

function HomeInfoTopHashTags({ selectedNetwork }) {
  return (<>
    {/* TOP 10 HASHTAGS CARD OF NETWORK */}
    <div className="homeinfo-card">
      <div className="homeinfo-card__header">
        <h3 className="homeinfo-card__header-title">
          <IoTrophySharp/>
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

function HomeInfoPinnedHashTags({ selectedNetwork }) {
    const [showInfo, toggleShowInfo] =
    useToggle(false);
  return (<>
    {/* HASHTAGS CARD OF NETWORK CONFIGURATION  */}

    {selectedNetwork?.tags &&
      selectedNetwork?.tags.length > 0 && (
        <div className="homeinfo-card">
          <div className="homeinfo-card__header homeinfo-card__header--openable" onClick={toggleShowInfo}>
              <h3 className="homeinfo-card__header-title">
                <IoPulseOutline/>
                {t('homeinfo.recommendedHashtags')}
              </h3>           
            <div className="homeinfo-card__controls">
              <Btn
                btnType={BtnType.corporative}
                iconLink={showInfo ? <IoArrowUpSharp/> : <IoArrowDownSharp/>}
                iconLeft={IconType.circle}
                contentAlignment={ContentAlignment.center}
              />
            </div>
          </div>
          {showInfo &&
          <>
            <hr></hr>

            <div className="homeinfo__description"></div>
            <div className="homeinfo__hashtags homeinfo__hashtags--admins">
              <TagsNav tags={selectedNetwork.tags} />
            </div>
          </>
          }
          
        </div>
      )}
  </>)
}


function HomeInfoRecentActivity({ selectedNetwork }) {
  const [activities, setActivities] = useState([]);
  const [showInfo, toggleShowInfo] =
    useToggle(false);
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
      <div className={(showInfo ? "homeinfo-card--opened-right ":" ") + " homeinfo-card homeinfo-card--activity"}>
      <div className="homeinfo-card__header homeinfo-card__header--openable" onClick={toggleShowInfo}>
          <ShowDesktopOnly>
            <div className="homeinfo-card__controls--openable-right">
                  <Btn
                    btnType={BtnType.corporative}
                    iconLink={showInfo ? <IoStatsChart/> : <IoStatsChart/>}
                    iconLeft={IconType.circle}
                    contentAlignment={ContentAlignment.center}
                  />
            </div>
          </ShowDesktopOnly>
          <h3 className="homeinfo-card__header-title" >
            {showInfo ? <IoStatsChart/> : <IoStatsChart/>}  
              {t('homeinfo.activity')}
          </h3>
          <ShowMobileOnly>
              <div className="homeinfo-card__controls--openable-right">
                    <Btn
                      btnType={BtnType.corporative}
                      iconLink={showInfo ? <IoStatsChart/> : <IoStatsChart/>}
                      iconLeft={IconType.circle}
                      contentAlignment={ContentAlignment.center}
                    />
              </div>
            </ShowMobileOnly>
      </div>
            <hr></hr>
            <div className="homeinfo__description homeinfo__description--openable">
              TODO
              {/* <ActivityList activities={activities} /> */}
            </div>
    </div>
  </>)
}

function HomeInfoAdministeredBy({ scrollToContact }) {

  return (<>
    <div className="homeinfo-card" ref={scrollToContact}>
      <div className="homeinfo-card__header">
        <h3 className="homeinfo-card__header-title">
          <IoHelpOutline/>
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

function HomeSloganCard({ selectedNetwork, config }) {
  return (<>
    {/* SLOGAN CARD */}
    <div className="homeinfo-card homeinfo__card--slogan-card">
      <div className="homeinfo-card__header homeinfo-card__header--slogan-card">
        <h3 className="homeinfo-card__header-title--slogan">
          {selectedNetwork.slogan}
        </h3>
      </div><hr></hr>
      <HomeInfoActionButton>
        <HomeInfoExploreButton />
        <HomeInfoCreateButton />
        <HomeInfoInviteButton/>
      </HomeInfoActionButton>
    </div></>)
}
        

function HomeInfoInstallCard({ selectedNetwork }) {
  const hasNotificationPermissions = useGlobalStore(
    (state: GlobalState) =>
      state.activities.notificationsPermissionGranted,
  );
  const isInstallable = useGlobalStore(
    (state: GlobalState) =>
      state.homeInfo.isInstallable,
  );
  return (
    <>
      {(isInstallable || hasNotificationPermissions) &&
        <div className="homeinfo-card">
          <div className="homeinfo-card__header">
            <h3 className="homeinfo-card__header-title">
              <IoDownloadOutline/>
              {t('homeinfo.install', [
                selectedNetwork?.name,
              ])}
            </h3>

            <div className="homeinfo-card__controls">

            </div>
          </div>
          <hr></hr>
          <HomeInfoActionButton>
            <InstallButton />
            <DesktopNotificationsButton />
          </HomeInfoActionButton></div>
      }</>)

}
function HomeInfoExploreButton() {
  return (

    <Btn
      btnType={BtnType.filterCorp}
      contentAlignment={ContentAlignment.center}
      iconLink={<IoMapOutline />}
      iconLeft={IconType.svg}
      extraClass="homeinfo__network-title-card--buttons"
      caption={t('homeinfo.goToExplore')}
      onClick={() => router.push('Explore')}
    />
  )
}

function HomeInfoCreateButton() {
  return (
    <Btn
      btnType={BtnType.filterCorp}
      contentAlignment={ContentAlignment.center}
      iconLeft={IconType.svg}
      iconLink={<IoAddCircle />}
      extraClass="homeinfo__network-title-card--buttons"
      caption={t('homeinfo.goToCreate')}
      onClick={() => router.push('ButtonNew')}
    />
  )
}

function HomeInfoInviteButton() {
  const onClick = () => {
      store.emit(
      new SetMainPopup(MainPopupPage.SHARE),
    )
  }
  return (
    <Btn
      btnType={BtnType.filterCorp}
      contentAlignment={ContentAlignment.center}
      iconLeft={IconType.svg}
      iconLink={<IoPersonAddOutline />}
       extraClass="homeinfo__network-title-card--buttons"

      caption={t('homeinfo.inviteToNetwork')}
      onClick={onClick}
    />
  )
}

function HomeInfoActionButton({ children }) {
  return (<div className="homeinfo-card__section">
    <div className="homeinfo-card__action-bottom">
      {children}
    </div></div>)
}

function HomeInfoKeyLocations({selectedNetwork}) {
  const [keyLocations, setKeyLocations] = useState([])
  useEffect(() => {
    store.emit(
        new ListKeyLocation((list) => {
          setKeyLocations(() => list)
        }),
    );
  }, []);
  
  const handleClick = (place) => {
    router.push(`/Explore/${place.zoom}/${place.latitude}/${place.longitude}/`)
  }
  return  (<>
  {keyLocations.length > 0 && 
    <div className="homeinfo-card">
      <div className="homeinfo-card__header">
        <h3 className="homeinfo-card__header-title">
          <IoLocateOutline/>
          {t('homeinfo.keyLocations')}
        </h3>

        <div className="homeinfo-card__controls">

        </div>
      </div>
      <hr></hr>

      <div className="homeinfo__hashtags">
        {keyLocations.map((place, idx) => {
          return <div key={idx} className="hashtags__list-item">
            <BtnCaption
              caption={`${place.address}`}
              selected={false}
              icon={null}
              color={'black'}
              onClick={() =>
                handleClick(place)
              }
            />
          </div>

        })}
      </div>

    </div>}</>)
}