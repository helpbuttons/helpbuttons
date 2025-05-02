import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import { ClienteSideRendering } from 'pages/_app';
import Loading from 'components/loading';
import t from 'i18n';
import { useGlobalStore, useStore } from 'state';
import { GlobalState, store } from 'state';
import { useMetadataTitle } from 'state/Metadata';
import HoneyComb from 'pages/Explore/HoneyComb';
import { ExploreSettings, UpdateExploreSettings } from 'state/Explore';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { roundCoord } from 'shared/honeycomb.utils';

export default function Explore({
    metadata
}) {
    const selectedNetwork = useStore(
        store,
        (state: GlobalState) => state.networks.selectedNetwork,
    );
    useMetadataTitle(t('menu.explore'))
    
    const router = useRouter();
    useParams(router)
    return (
        <>
            <ClienteSideRendering>
                {selectedNetwork &&
                    <HoneyComb selectedNetwork={selectedNetwork} />
                }
                {!selectedNetwork && <Loading />}
            </ClienteSideRendering>
        </>
    );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
    return setMetadata(t('menu.explore'), ctx);
};

function useParams(router) {

    const { zoom, lat, lng } = router.query;
    useEffect(() => {
        const _updateSettings: Partial<ExploreSettings> = {
            center: [roundCoord(Number(lat)), roundCoord(Number(lng))],
            zoom: Number(zoom),
        }
        store.emit(new UpdateExploreSettings(_updateSettings));
    }, [zoom, lat, lng]);
}