//QUESTIONS AND INFO
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import SEO from 'components/seo';
import { ServerPropsService } from 'services/ServerProps';


import NavHeader from '../../components/nav/NavHeader'

import Directory from '../../elements/Directory'
import Accordion from '../../elements/Accordion'
import Popup from 'components/popup/Popup'
import t from 'i18n';

export default function Faqs({
  metadata,
  selectedNetwork,
  config,
})
{

  const currentUser = useStore(
    store,
    (state: GlobalState) => state.loggedInUser,
  );

  return (

    <>

      <SEO {...metadata} />

      <Popup title={t('faqs.title')} linkFwd="/Explore">

        <Accordion title={t('faqs.networkQuestion', [selectedNetwork.name])}>
          <span className="highlight">{selectedNetwork.description}</span>.
        </Accordion>

        <Accordion title={t('faqs.helpbuttonsQuestion')}>
        <span className="highlight">{t('faqs.helpbuttonsHighlight')}</span> {t('faqs.helpbuttonsDescription')}
        </Accordion>

        <Accordion title={t('faqs.forQuestion')}>
          {t('faqs.forDescription')}
        </Accordion>

        <Accordion title={t('faqs.helpbuttonQuestion')}>
          {t('faqs.helpbuttonDescription')}
        </Accordion>

        <Accordion title={t('faqs.communityQuestion')}>
          {t('faqs.communityDescription')}
        </Accordion>

        <Accordion title={t('faqs.ethicsQuestion')}>
          {t('faqs.ethicsDescription')}
        </Accordion>

        <Accordion title={t('faqs.privacyQuestion')}>
          {t('faqs.privacyDescription')}
        </Accordion>

        <Accordion title={t('faqs.securityQuestion')}>
          {t('faqs.securityDescription')}
        </Accordion>

        <Accordion title={t('faqs.contactQuestion')}>
          {t('faqs.contactDescription')}
        </Accordion>

      </Popup>

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
        selectedNetwork: null,
      },
    };
  }
};