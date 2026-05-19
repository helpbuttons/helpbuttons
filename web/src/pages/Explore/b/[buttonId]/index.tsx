import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import t from 'i18n';
import { store } from 'state';
import { FindButton, updateCurrentButton } from 'state/Explore';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ExplorePage } from 'pages/Explore';
import { ErrorName } from 'shared/types/error.list';
import { alertService } from 'services/Alert';
import { useSelectedNetwork } from 'state/Networks';

export default function Explore({
    metadata
}) {
    const router = useRouter();
    const selectedNetwork = useSelectedNetwork()

    const { buttonId } = router.query;
    useEffect(() => {
        if(buttonId && selectedNetwork)
        {
          store.emit(new FindButton(buttonId as string, (button) => {
            store.emit(new updateCurrentButton(button))
            router.push(`/Explore/${selectedNetwork.exploreSettings.zoom}/${button.latitude}/${button.longitude}/${button.id}`, null, {shallow: true})
          }, (error) => {
            if(error.errorName == ErrorName.ButtonNotFound)
            {
              alertService.error(t(error.caption))
              router.push(`/Explore`, undefined, { shallow: true });
            }
          }))
        }
      }, [buttonId, selectedNetwork])
    return <ExplorePage/>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
    return setMetadata(t('menu.explore'), ctx);
};


