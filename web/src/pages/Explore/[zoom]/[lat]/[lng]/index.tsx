import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import t from 'i18n';
import { store } from 'state';
import { ExploreSettings, ResetExploreSettings } from 'state/Explore';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { roundCoord } from 'shared/honeycomb.utils';
import { ExplorePage } from 'pages/Explore';

export default function Explore({
    metadata
}) {

    const router = useRouter();
    const { zoom, lat, lng } = router.query;
    const init = useRef(false)
    useEffect(() => {
        if(!init.current){
            const _updateSettings: Partial<ExploreSettings> = {
                center: [roundCoord(Number(lat)), roundCoord(Number(lng))],
                zoom: Number(zoom),
            }
            store.emit(new ResetExploreSettings(_updateSettings));
            init.current = true;
        }
        
    }, []);
    return <ExplorePage/>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
    return setMetadata(t('menu.explore'), ctx);
};

