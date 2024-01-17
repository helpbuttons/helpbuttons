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
  IoAddOutline,
  IoGlobeOutline,
  IoHelpOutline,
  IoLogInOutline,
} from 'react-icons/io5';
import SEO from 'components/seo';
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


export default function HomeInfo({
  metadata,
  selectedNetwork,
  config,
}) {
  const [showFiltersForm, toggleShowFiltersForm] = useToggle(false);
  const [buttonTypes, setButtonTypes] = useState([]);
  useButtonTypes(setButtonTypes);
  
  const filterTag = (tag) => {
    store.emit(new UpdateFiltersToFilterTag(tag));
    router.push('/Explore')
  };

  const filterButtonType = (buttonType) => {
    store.emit(new UpdateFiltersToFilterButtonType(buttonType));
    router.push('/Explore')
  };
  
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
      <div className="info-overlay__search-section">
        <NavHeader
          toggleShowFiltersForm={toggleShowFiltersForm}
          totalNetworkButtonsCount={selectedNetwork.buttonCount}
          isHome={true}
        />
        <AdvancedFilters
          showFiltersForm={showFiltersForm}
          toggleShowFiltersForm={toggleShowFiltersForm}
          isHome={true}
        />
      </div>
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
                      '--network-jumbo': `url('/api/${selectedNetwork.jumbo}'`,
                    } as React.CSSProperties
                  }
                >
                  <div className="card__header">
                    <div className="avatar-medium--home">
                      <NetworkLogo network={selectedNetwork} />
                    </div>
                    <h3 className="card__header-title network-title">
                      {selectedNetwork.name}
                    </h3>
                  </div>

                  <div className="card__section card__section--actions">

                      <Btn
                        btnType={BtnType.corporative}
                        contentAlignment={ContentAlignment.center}
                        iconLeft={IconType.svg}
                        caption={t('homeinfo.goToExplore')}
                        onClick={()=>router.push('Explore')}
                      />

                      <Btn
                        btnType={BtnType.filterCorp}
                        contentAlignment={ContentAlignment.center}
                        iconLeft={IconType.svg}
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
                    {selectedNetwork.administrators.map((user, idx) => {
                        return (
                          <LinkAdminProfile user={user} key={idx}/>
                        )
                      })}
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
                            className='hashtags__list-item'
                            key={idx}
                            style={buttonColorStyle(
                              buttonType.cssColor,
                            )}
                          >
                            <Btn
                              btnType={BtnType.filter}
                              iconLeft={IconType.color}
                              caption={buttoTypeCountText}
                              onClick={() => filterButtonType(buttonType.name)}
                            />
                          </div>
                        );
                      })}
                    </div>
                    
                  </div>
                </div>

                {/* HASHTAGS CARD */}
                <div className="card">
                  <div className="card__header">
                    <h3 className="card__header-title">
                      {t('homeinfo.popularHashtags')}
                    </h3>
                  </div>
                  <hr></hr>
                  <div className="info-overlay__hashtags">
                  {selectedNetwork.topTags.map((tag, idx) => {
                      return <div className="hashtag" key={idx} onClick={() => filterTag(tag)}>{tag.tag} #{tag.count}</div>;
                    })}
                  </div>
                </div>


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
                    <NavLink href="mailto:mail@watchoutfreedom.com">
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
