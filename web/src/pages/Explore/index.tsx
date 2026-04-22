import Loading from "components/loading";
import t from "i18n";
import { NextPageContext } from "next";
import { useRouter } from "next/router";
import { ClienteSideRendering } from "pages/_app";
import { useEffect } from "react";
import { setMetadata } from "services/ServerProps";
import { GlobalState, store, useGlobalStore } from "state";
import HoneyComb from "./HoneyComb";
import { useSelectedNetwork } from "state/Networks";
import { SetHideNavBottom } from "state/HomeInfo";
import { useOnPageExit } from "shared/custom.hooks";
import { ResetFilters } from "state/Explore";

export default function Explore(props) {
  
    const router = useRouter();
    useParams(router)
    
  return <Loading/>
}

function useParams(router)
{

  const exploreSettings = useGlobalStore((state: GlobalState) => state.explore.settings)
  const selectedNetwork = useSelectedNetwork()

  useEffect(() => {
    
    if(exploreSettings?.center)
    {
      // load on last coordinates naviagated...!
      store.emit(new ResetFilters())
      router.push(`/Explore/${exploreSettings.zoom}/${exploreSettings.center[0]}/${exploreSettings.center[1]}`, undefined, { shallow: true });
    }else{
      // load from coordinates of network
      const centerLat = selectedNetwork.exploreSettings?.center ? selectedNetwork.exploreSettings?.center[0]: 0;
      const centerLng = selectedNetwork.exploreSettings?.center ? selectedNetwork.exploreSettings?.center[1]: 0;;
      router.push(`/Explore/${selectedNetwork.exploreSettings.zoom}/${centerLat}/${centerLng}`, undefined, { shallow: true });
    }
    
  }, [exploreSettings])
}


export const ExplorePage = () => {
  const selectedNetwork = useGlobalStore((state: GlobalState) => state.networks.selectedNetwork);

  useOnPageExit(() => store.emit(new SetHideNavBottom(false)))

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
