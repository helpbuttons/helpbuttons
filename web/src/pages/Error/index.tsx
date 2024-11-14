//ERROR PAGE
import NavBottom from 'components/nav/NavBottom';
import Popup from 'components/popup/Popup';
import router from 'next/router';
import t from 'i18n';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import { useMetadataTitle } from 'state/Metadata';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LinkAdmin } from 'components/user/LinkAdmin';
import { useGlobalStore } from 'store/Store';
import { GlobalState } from 'pages';

export default function Error({ metadata }) {
  useMetadataTitle('Error');

  const [errorCustomRaw, setErrorCustomRaw] = useState(null);
  useEffect(() => {
    if (!router.isReady) return;
    const _getCustomRaw = router.query.raw as string;
    setErrorCustomRaw(() => _getCustomRaw);
  }, [router.isReady]);
  return (
    <>
      <ErrorPopup errorCustomRaw={errorCustomRaw} />
      <NavBottom pageName="Error" loggedInUser={null} />
    </>
  );
}

function ErrorPopup({ errorCustomRaw = null }) {
  const selectedNetwork = useGlobalStore(
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  return (
    <Popup
      title={t('common.error')}
      linkBack={() => {
        // router.back()
        router.push('/HomeInfo');
      }}
    >
      <div className="error__message">
        {t('error.notFoundMessage')}
      </div>
      {errorCustomRaw && <code>{errorCustomRaw}</code>}
      <div className="homeinfo__description">
        {t('homeinfo.adminInstructions')}
        <div className="homeinfo__users">
          {selectedNetwork &&
            selectedNetwork.administrators &&
            selectedNetwork.administrators.map(
              (user, idx) => {
                return (
                  <LinkAdmin user={user} key={idx} />
                );
              },
            )}
        </div>
      </div>
    </Popup>
  );
}

export function ErrorLink({ errorMessage = null }) {
  const uriEncodedErrorMessage = encodeURI(errorMessage);
  return (
    <>
      Error loading message, please{' '}
      <Link href={`/Error?raw=${uriEncodedErrorMessage}`}>
        click here
      </Link>
      for more support
    </>
  );
}
export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata('Error', ctx);
};
