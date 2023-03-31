//EXPLORE MAP
import React, { useState, useEffect, useCallback } from 'react';

//components
import { FindButtons, updateExploreMapZoom, updateMapCenter, updateShowLeftColumn } from 'state/Explore';
import NavHeader from 'components/nav/NavHeader'; //just for mobile
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { useRouter } from 'next/router';
import List from 'components/list/List';
import { buttonTypes } from 'shared/buttonTypes';
import ExploreMap from 'components/map/Map/ExploreMap';
import { Button } from 'shared/entities/button.entity';
import { Bounds } from 'pigeon-maps';

export default function Explore() {
  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  const mapBondsButtons = useRef(
    store,
    (state: GlobalState) => state.explore.mapBondsButtons,
  );
  const currentButton = useRef( store,
    (state: GlobalState) => state.explore.currentButton,
  );
  const mapZoom = useRef( store,
    (state: GlobalState) => state.explore.mapZoom,
  );
  const mapCenter = useRef( store,
    (state: GlobalState) => state.explore.mapCenter,
  );
  const showLeftColumn = useRef( store,
    (state: GlobalState) => state.explore.showLeftColumn,
  );

  const router = useRouter();

  if (router && router.query && router.query.lat) {
    const lat = router.query.lat;
    const lng = router.query.lng;
    store.emit(new updateMapCenter([lat, lng]))
    store.emit(new updateExploreMapZoom(selectedNetwork.zoom))
  }

  const [filteredButtons, setFilteredButtons] = useState([]);

  const [buttonFilterTypes, setButtonFilterTypes] = useState(
    buttonTypes.map((buttonType) => buttonType.name),
  );

  const onLeftColumnToggle = (data) => {
    store.emit(new updateShowLeftColumn(!showLeftColumn))
  };

  const updateButtons = (bounds: Bounds) => {
    store.emit(new FindButtons(selectedNetwork.id, bounds));
  };
  const updateFiltersType = (type: string, value: boolean) => {
    if (value === true) {
      setButtonFilterTypes([...buttonFilterTypes, type]);
    }
    if (value === false) {
      setButtonFilterTypes((previous) =>
        previous.filter((value, i) => value != type),
      );
    }
  };


  useEffect(() => {
    if (mapBondsButtons !== null){
      setFilteredButtons(
        mapBondsButtons.filter((button: Button) => {
          return buttonFilterTypes.indexOf(button.type) >= 0;
        }),
      );
      }
      if (mapZoom == -1 && selectedNetwork)
      {
        store.emit(new updateMapCenter(selectedNetwork.location.coordinates))
        store.emit(new updateExploreMapZoom(selectedNetwork.zoom))
      }
  }, [mapBondsButtons, buttonFilterTypes, selectedNetwork, mapZoom]);

  return (
    <>
      {(selectedNetwork && mapZoom > 0) && (
        <div className="index__container">
          <div
            className={
              'index__content-left ' +
              (showLeftColumn ? '' : 'index__content-left--hide')
            }
          >
            <NavHeader
              showSearch={true}
              updateFiltersType={updateFiltersType}
            />
            <List
              buttons={filteredButtons}
              showLeftColumn={showLeftColumn}
              onLeftColumnToggle={onLeftColumnToggle}
            />
          </div>
          <ExploreMap
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            filteredButtons={filteredButtons}
            currentButton={currentButton}
            handleBoundsChange={updateButtons}
          />
        </div>
      )}
    </>
  );
}
