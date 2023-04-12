//EXPLORE MAP
import React, { useState, useEffect } from 'react';

//components
import { setButtonsAndDebounce, updateExploreMapZoom, updateMapCenter, updateShowLeftColumn } from 'state/Explore';
import NavHeader from 'components/nav/NavHeader'; //just for mobile
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { withRouter } from 'next/router';
import List from 'components/list/List';
import { buttonTypes } from 'shared/buttonTypes';
import ExploreMap from 'components/map/Map/ExploreMap';
import { Button } from 'shared/entities/button.entity';
import { Bounds, Point } from 'pigeon-maps';
import { Subject } from 'rxjs';

function Explore({ router }) {
  
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
  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );


  const timeInMsBetweenStrokes = 150; //ms
  const [sub, setSub] = useState(new Subject()); 
  const [sub$, setSub$] = useState(
    setButtonsAndDebounce(sub, timeInMsBetweenStrokes),
  ); 
  
  useEffect(() => {
    let s = sub$.subscribe(
      (rs: any) => {
        if (rs) {
          setFilteredButtons(rs)
        } else {
          console.error(
            'error getting buttons?!',
          );
        }
      },
      (e) => {
        console.log('error subscribe', e);
      },
    );
    return () => {
      s.unsubscribe(); //limpiamos
    };
  }, [sub$]); //first time
  

  const [filteredButtons, setFilteredButtons] = useState([]);

  const [buttonFilterTypes, setButtonFilterTypes] = useState(
    buttonTypes.map((buttonType) => buttonType.name),
  );

  const onLeftColumnToggle = (data) => {
    store.emit(new updateShowLeftColumn(!showLeftColumn))
  };

  const handleBoundsChange = (bounds, center :Point, zoom) => {
    store.emit(new updateMapCenter(center))
    store.emit(new updateExploreMapZoom(zoom))
    updateButtons(bounds)
  }
  const updateButtons = (bounds: Bounds) => {
    sub.next(
      JSON.stringify({
      networkId: selectedNetwork.id,
      bounds: bounds,
      }));
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
    let loadCoordinatesFromNetwork = true
    if (router && router.query && router.query.lat) {
      const lat = parseFloat(router.query.lat);
      const lng = parseFloat(router.query.lng);
      store.emit(new updateExploreMapZoom(16));
      store.emit(new updateMapCenter([lat, lng]))
      loadCoordinatesFromNetwork = false;
    }
  
    if (mapBondsButtons !== null){
      setFilteredButtons(
        mapBondsButtons.filter((button: Button) => {
          return buttonFilterTypes.indexOf(button.type) >= 0;
        }),
      );
      }
      if ((!mapCenter || !mapZoom) && selectedNetwork)
      {
        if(loadCoordinatesFromNetwork){
          store.emit(new updateMapCenter(selectedNetwork.location.coordinates))
        }
        store.emit(new updateExploreMapZoom(selectedNetwork.zoom))
      }

  }, [mapBondsButtons, buttonFilterTypes, selectedNetwork, router]);

  const handleSelectedPlace = (place) => {
    store.emit(new updateMapCenter([place.geometry.lat, place.geometry.lng]))
    store.emit(new updateExploreMapZoom(16))
  };

  return (
    <>
      {(selectedNetwork && mapZoom > 0 && mapCenter) && (
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
              handleSelectedPlace={handleSelectedPlace}
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
            handleBoundsChange={handleBoundsChange}
          />
        </div>
      )}
    </>
  );
}

export default withRouter(Explore)
