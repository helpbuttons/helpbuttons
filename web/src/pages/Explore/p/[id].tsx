import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import t from 'i18n';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from 'components/loading';
import { useKeyLocations } from 'state/Geo';
import { keyLocationZoom } from 'components/map/Map/Map.consts';

export default function ExploreButtonId({
    metadata
}) {
    const router = useRouter();
    const { id } = router.query;

    const keyLocations = useKeyLocations()

    useEffect(() => {
      if(keyLocations && id){
        const keyLocation = keyLocations.find((_kl) => _kl.id == id)
        if(keyLocation) {
          router.push(`/Explore/${keyLocationZoom}/${keyLocation.latitude}/${keyLocation.longitude}`, null, {shallow: true})
        }
      }
    }, [keyLocations, id])
    
    return <Loading/>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
    return setMetadata(t('menu.explore'), ctx);
};