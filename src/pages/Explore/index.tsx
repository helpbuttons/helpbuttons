//EXPLORE MAP
import React, { useState, useEffect } from "react";

//components
// import { GetButtonsEvent } from 'pages/Explore/data.tsx';
import { FindButtons } from 'pages/Explore/data.tsx';
import Map from "components/map/LeafletMap";
import List from "components/list/List";
import NavHeader from "components/nav/NavHeader"; //just for mobile
import { useRef } from "store/Store";
import { GlobalState, store } from "pages";

export default function Explore() {
  const selectedNetwork = useRef(store, (state: GlobalState) => state.common.selectedNetwork);
  const visibleButtons = useRef(store, (state: GlobalState) => state.explore.visibleButtons);

  const [showLeftColumn, setShowLeftColumn] = useState(true);

  const onchange = (data) => {
      setShowLeftColumn(!showLeftColumn);
  }

  useEffect(() => {
    if (selectedNetwork) {
      store.emit(new FindButtons(selectedNetwork.id));
    }
  }, [selectedNetwork])
  
  return (
    <div className="index__container">
      <div className={'index__content-left ' + (showLeftColumn ? '' : 'index__content-left--hide')}>
        <NavHeader showSearch={showLeftColumn}/>
        {visibleButtons && false && (
          <List buttons={visibleButtons} showLeftColumn={showLeftColumn} onchange={(e) => { onchange(e) }} />
        )}
      </div>
      {selectedNetwork && (
        <Map buttons={visibleButtons}
             initialLocation={{
               lat: selectedNetwork.location.coordinates[0],
               lng: selectedNetwork.location.coordinates[1],
             }}/>
      )}
      </div>

  );
}
