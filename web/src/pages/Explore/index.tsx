//EXPLORE MAP
import React, { useState, useEffect } from "react";

//components
import { FindButtons, SetAsCurrentButton } from 'state/Explore';
import NavHeader from "components/nav/NavHeader"; //just for mobile
import { useRef } from "store/Store";
import { GlobalState, store } from "pages";
import { Bounds } from "leaflet";
import { IButton } from "services/Buttons/button.type";
import { useRouter } from "next/router";
import ExploreButtonsMap from "components/map/LeafletMap/ExploreButtonsMap";
import { alertService } from "services/Alert";
import List from "components/list/List";

export default function Explore() {
  const selectedNetwork = useRef(store, (state: GlobalState) => state.networks.selectedNetwork);
  const mapBondsButtons = useRef(store, (state: GlobalState) => state.explore.mapBondsButtons);

  const router = useRouter()

  let lat = 0
  let lng = 0
  let zoom = 2;

  if (selectedNetwork)
  {
    lat = selectedNetwork.location.coordinates[0]
    lng = selectedNetwork.location.coordinates[1]
    zoom = selectedNetwork.zoom ;
  }
  if (router && router.query && router.query.lat)
  {
    lat = router.query.lat;
    lng = router.query.lng;
    zoom = 13;
  }
  

  const [showLeftColumn, setShowLeftColumn] = useState(false);
  const [filteredButtons, setFilteredButtons] = useState([]);

  const [buttonFilterTypes, setButtonFilterTypes] = useState(["need", "offer", "exchange"]);

  const onLeftColumnToggle = (data) => {
      setShowLeftColumn(!showLeftColumn);
  }

  const updateButtons = (bounds: Bounds) => {
    store.emit(new FindButtons(selectedNetwork.id, bounds));
  }
  const updateFiltersType = (type: string, value: boolean) => {
    if (value === true) {
      setButtonFilterTypes([...buttonFilterTypes, type]);
    }
    if (value === false) {
      setButtonFilterTypes(previous => (
        previous.filter((value, i) => value != type))
      )
        
    }
  }
  useEffect(() => {
    if (mapBondsButtons !== null)
      setFilteredButtons(mapBondsButtons.filter((button: IButton) => {
        return buttonFilterTypes.indexOf(button.type) >= 0
      }))
  }, [mapBondsButtons, buttonFilterTypes]);
  

  const onMarkerClick = (buttonId) => {
    store.emit(new SetAsCurrentButton(buttonId));
  };
  
  return (
    <>
    {selectedNetwork &&
    <div className="index__container">
      <div className={'index__content-left ' + (showLeftColumn ? '' : 'index__content-left--hide')}>
        <NavHeader showSearch={true} updateFiltersType={updateFiltersType} />
        <List buttons={filteredButtons} showLeftColumn={showLeftColumn} onLeftColumnToggle={onLeftColumnToggle}/>
      </div>
        <ExploreButtonsMap
          initMapCenter={{
            lat: lat,
            lng: lng,
          }}
          buttons={filteredButtons}
          onBoundsChange={updateButtons}
          onMarkerClick={onMarkerClick}
          defaultZoom={zoom}
        />
      </div>
}</>
  );
}
