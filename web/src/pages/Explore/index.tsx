import { LoadabledComponent } from "components/loading";
import { BrowseType } from "components/map/Map/Map.consts";
import { GlobalState, store } from "pages";
import { useEffect, useState } from "react";
import { useRef } from "store/Store";
import HoneyComb from "./HoneyComb";


export default function Explore() {
    const [browseType, setBrowseType] = useState(null)
    const selectedNetwork = useRef(
        store,
        (state: GlobalState) => state.networks.selectedNetwork,
      );

      useEffect(() => {
        if(selectedNetwork){
            setBrowseType(() => {
                return selectedNetwork.exploreSettings.browseType
            })
        }
      },[selectedNetwork])
    return (
 
        <LoadabledComponent loading={!browseType}>

            { browseType == BrowseType.HONEYCOMB &&
                <HoneyComb/>
            }
        </LoadabledComponent> 
    )
}
