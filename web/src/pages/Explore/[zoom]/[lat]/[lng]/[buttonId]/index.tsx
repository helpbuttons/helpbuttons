import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import t from 'i18n';
import { useGlobalStore } from 'state';
import { GlobalState, store } from 'state';
import { ExploreSettings, FindButton, updateCurrentButton, UpdateExploreSettings } from 'state/Explore';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { markerFocusZoom } from 'components/map/Map/Map.consts';
import { ExplorePage } from 'pages/Explore';
import { ErrorName } from 'shared/types/error.list';
import { alertService } from 'services/Alert';

export default function Explore({
    metadata
}) {
    const router = useRouter();

    const centerMapToButton = (button) => {
      const _updateSettings: Partial<ExploreSettings> = {
        center: [button.latitude, button.longitude],
        zoom: markerFocusZoom,
      }
      store.emit(new UpdateExploreSettings(_updateSettings));
    }

    const { buttonId, zoom, lat, lng } = router.query;
    const currentButton = useGlobalStore((state: GlobalState) => state.explore.currentButton)
    useEffect(() => {
        if(buttonId && (!currentButton || currentButton?.id != buttonId))
        {
          store.emit(new FindButton(String(buttonId), (button) => {
            store.emit(new updateCurrentButton(button))
            centerMapToButton(button)
          }, (error) => {
            if(error.errorName == ErrorName.ButtonNotFound)
            {
              alertService.error(error.caption)
              router.push(`/Explore/${zoom}/${lat}/${lng}`)
            }
          }))
        }else{
          centerMapToButton(currentButton)
        }
      }, [buttonId])
    return <ExplorePage/>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
    return setMetadata(t('menu.explore'), ctx);
};


