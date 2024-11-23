import { NextPageContext } from 'next';
import HoneyComb from '../HoneyComb';
import { setMetadata } from 'services/ServerProps';
import { ClienteSideRendering } from 'pages/_app';
import Loading from 'components/loading';
import t from 'i18n';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { useMetadataTitle } from 'state/Metadata';

export default function Explore({
  metadata
}) {
  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  useMetadataTitle(t('menu.explore'))

  return (
    <>
      <ClienteSideRendering>
        {selectedNetwork && 
          <HoneyComb selectedNetwork={selectedNetwork} />
        }
        {!selectedNetwork && <Loading/>}
      </ClienteSideRendering>
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('menu.explore'), ctx);
};
