import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import t from 'i18n';
import { store } from 'state';
import { ExploreSettings, UpdateExploreSettings } from 'state/Explore';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { roundCoord } from 'shared/honeycomb.utils';
import { ExplorePage } from 'pages/Explore';

export default function Explore({
    metadata
}) {

    const router = useRouter();
    const { zoom, lat, lng } = router.query;
    useEffect(() => {
        const _updateSettings: Partial<ExploreSettings> = {
                    center: [roundCoord(Number(lat)), roundCoord(Number(lng))],
                    zoom: Number(zoom),
                }
                store.emit(new UpdateExploreSettings(_updateSettings));
    }, []);
    return <ExplorePage/>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
    return setMetadata(t('menu.explore'), ctx);
};