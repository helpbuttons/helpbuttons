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
import { getServerSidePropsHandler, shouldEnableSSR } from 'shared/tauri.utils';
import { ResetFilters } from "state/Explore";
import { roundCoords } from "shared/honeycomb.utils";

export default function Explore(props) {
  
    const router = useRouter();
    useParams(router)
    
  return <Loading/>
}

function useParams(router)
{

  const selectedNetwork = useSelectedNetwork()

  useEffect(() => {
    if(selectedNetwork)
    {
      const center = roundCoords(selectedNetwork.exploreSettings.center)
      router.push(`/Explore/${selectedNetwork.exploreSettings.zoom}/${center[0]}/${center[1]}`, undefined, { shallow: true });
    }
    
  }, [selectedNetwork])
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


export const getServerSideProps = shouldEnableSSR
  ? (ctx) => getServerSidePropsHandler(t('menu.explore'), ctx)
  : undefined;
