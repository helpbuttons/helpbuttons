import Loading from "components/loading";
import t from "i18n";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { setMetadata } from "services/ServerProps";
import { GlobalState, store, useGlobalStore } from "state";
import { RecenterExplore, UpdateFilters } from "state/Explore";

export default function Explore({
  metadata
}) {

    const router = useRouter();
    useParams(router)
    
  return <Loading/>
}

function useParams(router)
{

  const exploreSettings = useGlobalStore((state: GlobalState) => state.explore.settings)

  useEffect(() => {
    if(exploreSettings?.center)
    {
      router.push(`/Explore/${exploreSettings.zoom}/${exploreSettings.center[0]}/${exploreSettings.center[1]}`, undefined, { shallow: true });
    }else{
      store.emit(new RecenterExplore())
    }
    
  }, [exploreSettings])
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('menu.explore'), ctx);
};
