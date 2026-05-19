import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import t from 'i18n';
import { useGlobalStore } from 'state';
import { GlobalState, store } from 'state';
import { UpdateExploreSettings } from 'state/Explore';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ExplorePage } from 'pages/Explore';
import { alertService } from 'services/Alert';

export default function Explore({
    metadata
}) {
    const router = useRouter();

    const { buttonId, zoom, lat, lng } = router.query;
    const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)
    useEffect(() => {
        if(currentButton?.id == buttonId){
           store.emit(new UpdateExploreSettings({center: [parseFloat(lat as string), parseFloat(lng as string)], zoom: parseInt(zoom as string)}));
        }else{
            alertService.warn('error')
        }
      }, [currentButton])
    return <ExplorePage/>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
    return setMetadata(t('menu.explore'), ctx);
};


