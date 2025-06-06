import Loading from "components/loading";
import t from "i18n";
import { NextPageContext } from "next";
import { NextRouter, useRouter } from "next/router";
import { ClienteSideRendering } from "pages/_app";
import { useEffect } from "react";
import { setMetadata } from "services/ServerProps";
import { GlobalState, store, useGlobalStore } from "state";
import { RecenterExplore } from "state/Explore";
import HoneyComb from "./HoneyComb";
import { useSelectedNetwork } from "state/Networks";

export default function Explore(props) {
  
    const router = useRouter();
    useParams(router)
    
  return <Loading/>
}

function useParams(router: NextRouter)
{

  const exploreSettings = useGlobalStore((state: GlobalState) => state.explore.settings)
  const selectedNetwork = useSelectedNetwork()

  useEffect(() => {
    if(exploreSettings?.center)
    {
      // load on last coordinates naviagated...!
      router.replace(`/Explore/${exploreSettings.zoom}/${exploreSettings.center[0]}/${exploreSettings.center[1]}`, undefined, { shallow: true });
    }else{
      // load from coordinates of network
      router.replace(`/Explore/${selectedNetwork.exploreSettings.zoom}/${selectedNetwork.exploreSettings.center[0]}/${selectedNetwork.exploreSettings.center[1]}`, undefined, { shallow: true });
    }
    
  }, [exploreSettings])
}


export const ExplorePage = () => {
  const selectedNetwork = useGlobalStore((state: GlobalState) => state.networks.selectedNetwork);
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
