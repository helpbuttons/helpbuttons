//EXPLORE MAP
import React, { useState, useEffect } from "react";

//components
import { GetButtonsEvent } from 'pages/Explore/data.tsx';
import Map from "components/map/LeafletMap";
import List from "components/list/List";
import NavHeader from "components/nav/NavHeader"; //just for mobile
import { useRef } from "store/Store";
import { GlobalState, store } from "pages";

export default function Explore() {

  const [showLeftColumn, setShowLeftColumn] = useState(true);

  const onchange = (data) => {
      setShowLeftColumn(!showLeftColumn);
  }

  const [buttons, setButtons] = useState({
    btns: []
  })

  useEffect(() => {

    return GetButtonsEvent(setButtons);

  }, [])

  const selectedNetwork = useRef(store, (state: GlobalState) => state.commonData.selectedNetwork);
  
  return (

        <div className="index__container">
          <div className={'index__content-left ' + (showLeftColumn ? '' : 'index__content-left--hide')}>
            <NavHeader showSearch={showLeftColumn}/>
            <List buttons={buttons.btns} showLeftColumn={showLeftColumn} onchange={(e) => { onchange(e) }}  />
      </div>
      {selectedNetwork && (
        <Map buttons={buttons.btns}
        initialLocation={{
                lat: selectedNetwork.location.coordinates[0],
                lng: selectedNetwork.location.coordinates[1],
              }}/>
      )}
        </div>

  );
}
