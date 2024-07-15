import { setMetadata } from 'services/ServerProps';
import Accordion from '../../elements/Accordion'
import Popup from 'components/popup/Popup'
import t from 'i18n';
import { NextPageContext } from 'next';
import { useSearchParams } from 'next/navigation';
import router, { Router } from 'next/router';

export default function Faqs({
  metadata,
  _selectedNetwork,
  config,
})
{
  const searchParams = useSearchParams();
  const chapter = searchParams.get('chapter');

  return (

    <>
      <Popup title={t('faqs.title')} linkBack={() => router.back()}>

        <Accordion title={t('faqs.networkQuestion', [_selectedNetwork.name])}>
          <span className="highlight">{_selectedNetwork.description}</span>.
        </Accordion>

        <Accordion title={t('faqs.helpbuttonsQuestion')}>
        <span className="highlight">{t('faqs.helpbuttonsHighlight')}</span> {t('faqs.helpbuttonsDescription')}
        </Accordion>

        <Accordion title={t('faqs.privacyQuestion')} collapsed={chapter == 'privacyPolicy'}>
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

        <Accordion title={t('faqs.networkEthics', [_selectedNetwork.name])}>
          {t('faqs.networksEthicsDescription', [_selectedNetwork.name])}
        </Accordion>

        <Accordion title={t('faqs.ethicsQuestion')}>
          {t('faqs.ethicsDescription')}
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
  return setMetadata('F.A.Q.', ctx)
};