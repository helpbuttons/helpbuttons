//EXPLORE MAP
import React, { useState, useEffect } from "react";

//components
import { FindButtons } from 'state/Explore';
import Map from "components/map/LeafletMap";
import List from "components/list/List";
import NavHeader from "components/nav/NavHeader"; //just for mobile
import { useRef } from "store/Store";
import { GlobalState, store } from "pages";
import { Bounds } from "leaflet";
import { useRouter } from "next/router";

export default function Explore() {
  const selectedNetwork = useRef(store, (state: GlobalState) => state.networks.selectedNetwork);
  const visibleButtons = useRef(store, (state: GlobalState) => state.explore.visibleButtons);

  const router = useRouter()

  const lat = selectedNetwork ? selectedNetwork.location.coordinates[0] :router.query.lat;
  const lng = selectedNetwork ? selectedNetwork.location.coordinates[1] : router.query.lng;

  const [showLeftColumn, setShowLeftColumn] = useState(true);

  const onchange = (data) => {
      setShowLeftColumn(!showLeftColumn);
  }

  const updateButtons = (bounds: Bounds) => {
    store.emit(new FindButtons(selectedNetwork.id, bounds));
  }
  
  return (
    <div className="index__container">
      <div className={'index__content-left ' + (showLeftColumn ? '' : 'index__content-left--hide')}>
        <NavHeader showSearch={showLeftColumn}/>
        {visibleButtons && (
          <List buttons={visibleButtons} showLeftColumn={showLeftColumn} onchange={(e) => { onchange(e) }} />
        )}
      </div>
        <Map buttons={visibleButtons}
             initialLocation={{
               lat,
               lng,
             }}
             onBoundsChange={updateButtons}
             />
      </div>

  );
}
