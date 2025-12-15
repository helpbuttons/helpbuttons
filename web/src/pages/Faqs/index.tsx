import { setMetadata } from 'services/ServerProps';
import Accordion from '../../elements/Accordion';
import Popup from 'components/popup/Popup';
import t from 'i18n';
import { NextPageContext } from 'next';
import { useSearchParams } from 'next/navigation';
import router, { Router } from 'next/router';
import { useStore } from 'state';
import { GlobalState, store } from 'state';
import { LoadabledComponent } from 'components/loading';
import { useMetadataTitle } from 'state/Metadata';
import Footer from 'components/footer';

export default function Faqs({ metadata }) {
  useMetadataTitle('F.A.Q.')

  return (
    <>
      <Popup title={t('faqs.title')} linkBack={() => router.back()}>
        <FaqSections />
      </Popup>
      <Footer />

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

      <Accordion
        title={t('faqs.privacyQuestion')}
        collapsed={chapter == 'privacyPolicy'}
      >
        {selectedNetwork?.privacyPolicy}
      </Accordion>

      <Accordion title={t('faqs.ethicsQuestion')}>
        {selectedNetwork?.ethicsPolicy}
      </Accordion>

      <Accordion
        title={t('faqs.cookiesQuestion')}
      >
        {t('faqs.cookiesDescription')}
      </Accordion>

      {/* <Accordion title={t('faqs.helpbuttonsQuestion')} collapsed={chapter == 'whats'}>
        <span className="highlight">
          {t('faqs.helpbuttonsHighlight')}
        </span>{' '}
        {t('faqs.helpbuttonsDescription')}
      </Accordion> */}
    </>
  );
}
export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata('F.A.Q.', ctx);
};
