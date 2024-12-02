import { setMetadata } from 'services/ServerProps';
import Accordion from '../../elements/Accordion';
import Popup from 'components/popup/Popup';
import t from 'i18n';
import { NextPageContext } from 'next';
import { useSearchParams } from 'next/navigation';
import router, { Router } from 'next/router';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { LoadabledComponent } from 'components/loading';
import { useMetadataTitle } from 'state/Metadata';

export default function Faqs({ metadata }) {
  useMetadataTitle('F.A.Q.')

  return (
    <>
      <Popup title={t('faqs.title')} linkBack={() => router.back()}>
        <FaqSections />
      </Popup>
    </>
  );
}

export function FaqSections() {
  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  const searchParams = useSearchParams();
  const chapter = searchParams.get('chapter');

  return (
    <>
      <Accordion
        title={t('faqs.networkQuestion', [selectedNetwork?.name])}
      >
        <span className="highlight">
          {selectedNetwork?.description}
        </span>
        .
      </Accordion>

      <Accordion title={t('faqs.helpbuttonsQuestion')}>
        <span className="highlight">
          {t('faqs.helpbuttonsHighlight')}
        </span>{' '}
        {t('faqs.helpbuttonsDescription')}
      </Accordion>

      <Accordion
        title={t('faqs.privacyQuestion')}
        collapsed={chapter == 'privacyPolicy'}
      >
        {t('faqs.privacyDescription')}
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

      <Accordion
        title={t('faqs.networkEthics', [selectedNetwork?.name])}
      >
        {t('faqs.networksEthicsDescription', [selectedNetwork?.name])}
      </Accordion>

      <Accordion title={t('faqs.ethicsQuestion')}>
        {t('faqs.ethicsDescription')}
      </Accordion>

      <Accordion title={t('faqs.securityQuestion')}>
        {t('faqs.securityDescription')}
      </Accordion>

      <Accordion 
        accordionId={"cookies"}
        title={t('faqs.cookiesQuestion')}
      >
        {t('faqs.cookiesDescription')}
      </Accordion>

      <Accordion title={t('faqs.contactQuestion')}>
        {t('faqs.contactDescription')}
      </Accordion>
    </>
  );
}
export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata('F.A.Q.', ctx);
};
