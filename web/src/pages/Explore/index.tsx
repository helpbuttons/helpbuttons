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

  const lat = (selectedNetwork && !router.query.lat) ? selectedNetwork.location.coordinates[0] : router.query.lat;
  const lng = (selectedNetwork && !router.query.lng) ? selectedNetwork.location.coordinates[1] : router.query.lng;


  const [showLeftColumn, setShowLeftColumn] = useState(true);
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
        <NavHeader showSearch={showLeftColumn} updateFiltersType={updateFiltersType} />
        {filteredButtons.length > 0 && 
          <List buttons={filteredButtons} showLeftColumn={showLeftColumn} onLeftColumnToggle={onLeftColumnToggle}/>
        }
      </div>
        <ExploreButtonsMap
          initMapCenter={{
            lat: selectedNetwork.location.coordinates[0],
            lng: selectedNetwork.location.coordinates[1],
          }}
          buttons={filteredButtons}
          onBoundsChange={updateButtons}
          onMarkerClick={onMarkerClick}
          defaultZoom={selectedNetwork.zoom}
        />
      </div>
}</>
  );
}
