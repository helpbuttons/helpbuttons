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
  IoAdd,
  IoAddCircle,
  IoAddOutline,
  IoCall,
  IoCallOutline,
  IoClose,
  IoCloseOutline,
  IoGlobeOutline,
  IoHelpOutline,
  IoLogInOutline,
  IoLogoWhatsapp,
  IoMagnet,
  IoMail,
  IoMailOutline,
  IoMapOutline,
  IoSearch,
  IoSend,
  IoSendOutline,
} from 'react-icons/io5';
import { ServerPropsService } from 'services/ServerProps';
import { NextPageContext } from 'next';
import {  useState } from 'react';
import { buttonColorStyle, useButtonTypes } from 'shared/buttonTypes';
import AdvancedFilters from 'components/search/AdvancedFilters';
import { useToggle } from 'shared/custom.hooks';
import { UpdateFiltersToFilterButtonType, UpdateFiltersToFilterTag } from 'state/Explore';
import Alert from 'components/overlay/Alert';
import { formatMessage } from 'elements/Message';
import { LinkProfile } from 'components/user/LinkProfile';
import { LinkAdminProfile } from 'components/user/LinkAdminProfile';
import { ShowMobileOnly } from 'elements/SizeOnly';
import { ListButtonTypes } from 'components/nav/ButtonTypes';
import getConfig from 'next/config';


export default function HomeInfo({
  metadata,
  selectedNetwork,
  config,
}) {
  const filterTag = (tag) => {
    store.emit(new UpdateFiltersToFilterTag(tag));
    router.push('/Explore')
  };
  
  const { publicRuntimeConfig } = getConfig()
  const apiUrl = publicRuntimeConfig.apiUrl;

  const currentUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  const [showMessage, toggleShowMessage] = useToggle(false);
  const [showContactDialog, toggleshowContactDialog] = useToggle(true);

  const [navigatorCoordinates, setNavigatorCoordinates] =
    useState(null);

  if(!config)
  {
    return (<Alert>Error getting backend</Alert>)
  }
  
  return (
    <>
        <ShowMobileOnly>
          <div className="info-overlay__search-section">
            <NavHeader selectedNetwork={selectedNetwork} pageName={'HomeInfo'}/>
            <AdvancedFilters isHome={true}/>
          </div>
        </ShowMobileOnly>

        {showContactDialog &&
            <div className="card-alert__container card-alert__container--bottom">
              <div className="card-alert card-alert--error">
                {showMessage ? 
                  <>
                      <div className='card-alert__btn-options'>
                        <Btn
                          btnType={BtnType.circle}
                          iconLink={<IoCallOutline />}
                          iconLeft={IconType.circle}
                          contentAlignment={ContentAlignment.center}
                        />

                        <Btn
                          btnType={BtnType.circle}
                          iconLink={<IoMailOutline />}
                          iconLeft={IconType.circle}
                          contentAlignment={ContentAlignment.center}
                        />

                        <Btn
                          btnType={BtnType.circle}
                          iconLink={<IoLogoWhatsapp />}
                          iconLeft={IconType.circle}
                          contentAlignment={ContentAlignment.center}
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
                :
                <>
                  <div className="card-alert__content">
                      {t("homeinfo.callToAdmin")}
                      <Btn
                      btnType={BtnType.circle}
                      iconLink={<IoCall />}
                      iconLeft={IconType.circle}
                      contentAlignment={ContentAlignment.center}
                      onClick={() => toggleShowMessage(true)}
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
                }
              </div>
            </div> 
        }
         
      <div
        className='info-overlay__container'
      >
          

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

                

                {/* INFO CARD */}
                <div className="card info-overlay__card--header"
                                  
                  style={
                    {
                      '--network-jumbo': `url('${apiUrl}${selectedNetwork.jumbo}'`,
                    } as React.CSSProperties
                  }
                >
                  <div className="card__header">
                    <div className='info-overlay__network-title'>
                      <div className="avatar-medium--home">
                        <NetworkLogo network={selectedNetwork} />
                      </div>
                      <h3 className="card__header-title network-title">
                        {selectedNetwork.name}
                      </h3>
                    </div>
                  </div>

                  <div className="card__section card__section--actions">

                      <Btn
                        btnType={BtnType.corporative}
                        contentAlignment={ContentAlignment.center}
                        iconLink={<IoMapOutline/>}
                        iconLeft={IconType.svg}
                        caption={t('homeinfo.goToExplore')}
                        onClick={()=>router.push('Explore')}
                      />

                      <Btn
                        btnType={BtnType.corporative}
                        contentAlignment={ContentAlignment.center}
                        iconLeft={IconType.svg}
                        iconLink={<IoAddCircle/>}
                        extraClass='info-overlay__network-title-card--buttons'
                        caption={t('homeinfo.goToCreate')}
                        onClick={()=>router.push('ButtonNew')}
                      />  
                  </div>
                </div>

                {/*  INFO CARD */}
                <div className="card">
                  <div className="card__header">
                    <h3 className="card__header-title">
                        {t('homeinfo.info')}
                    </h3>
                  </div>
                  <hr></hr>
                  <div className="info-overlay__description">
                    {formatMessage(selectedNetwork.description)}
                  </div>
                </div>

                <div className="card">
                  <div className="card__header">
                    <h3 className="card__header-title">
                    {t('homeinfo.administeredby')}
                    </h3>
                  </div>
                  <hr></hr>
                  <div className="info-overlay__description">
                        {t('homeinfo.adminInstructions')}
                      <div className="info-overlay__users">
                        {selectedNetwork.administrators.map((user, idx) => {
                            return (
                              <LinkAdminProfile user={user} key={idx}/>
                            )
                          })}
                       </div>
                  </div>
                </div>

                {/* STATS CARD */}
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
                      config.userCount.toString(),
                    ])}
                    <div className="info-overlay__hashtags">
                      <ListButtonTypes selectedNetwork={selectedNetwork}/>
                    </div>
                    
                  </div>
                </div>

                {/* TOP 10 HASHTAGS CARD OF NETWORK */}
                <div className="card">
                  <div className="card__header">
                    <h3 className="card__header-title">
                      {t('homeinfo.popularHashtags')}
                    </h3>
                  </div>
                  <hr></hr>
                  <div className="info-overlay__hashtags">
                  {selectedNetwork.topTags.map((tag, idx) => {
                      return <div className="hashtag" key={idx} onClick={() => filterTag(tag.tag)}>{tag.tag}</div>;
                    })}
                  </div>
                </div>

                {/* HASHTAGS CARD OF NETWORK CONFIGURATION  */}
                {selectedNetwork.tags.count >= 0  &&    
                
                  <div className="card">
                    <div className="card__header">
                      <h3 className="card__header-title">
                        {t('homeinfo.recommendedHashtags')}
                      </h3>
                    </div>
                    <hr></hr>
                    <div className="info-overlay__hashtags">
                    {selectedNetwork.tags.map((tag, idx) => {
                        return <div className="hashtag" key={idx} onClick={() => filterTag(tag)}>{tag}</div>;
                      })}
                    </div>
                  </div>
                }


                {/* ACTIONS CARD */}
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
                  <div className="card__section">
                    <p>{t('homeinfo.createNetwork')}</p>
                    <NavLink href="https://helpbuttons.org">
                      <IoAddOutline />
                      <span>{t('homeinfo.createNetworkButton')}</span>
                    </NavLink>
                  </div>
                   {/* <div className="card__section">
                      <p>{t('homeinfo.donateSubtitle')}</p>
                        <NavLink href="https://buy.stripe.com/dR68wx3CY17VdFKfZc">
                        <IoCashOutline />
                        <span>{t('menu.donate')}</span>
                      </NavLink>
                    </div> */}
                </div>
              </div>
            </>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  try {
    const serverProps = await ServerPropsService.general('Home', ctx);
    return { props: serverProps };
  } catch (err) {
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