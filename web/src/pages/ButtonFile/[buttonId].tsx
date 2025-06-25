import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import { setMetadata } from 'services/ServerProps'
import t from 'i18n'
import { ExploreSettings, FindButton, UpdateExploreSettings } from 'state/Explore'
import { store } from 'state'
import { markerFocusZoom, maxZoom } from 'components/map/Map/Map.consts'
export default function ButtonFile({
  metadata,
}) {
  const router = useRouter()
  const { buttonId } = router.query;

  useEffect(() => {
    if(buttonId)
    {
      store.emit(new FindButton(String(buttonId), (button) => {
      const _updateSettings: Partial<ExploreSettings> = {
        center: [button.latitude, button.longitude],
        zoom: markerFocusZoom,
    }
    store.emit(new UpdateExploreSettings(_updateSettings));
      router.replace(`/Explore/${markerFocusZoom}/${button.latitude}/${button.longitude}/${buttonId}`)
      }))
    }
    
  }, [buttonId])
  
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('seo.buttonEdit'), ctx);
};