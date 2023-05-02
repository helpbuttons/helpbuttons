//EXPLORE MAP
import React, { useState, useEffect } from 'react';

//components
import {
  ButtonsFound,
  setButtonsAndDebounce,
  updateCurrentButton,
  updateExploreMapZoom,
  updateMapCenter,
  updateShowLeftColumn,
} from 'state/Explore';
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
import { LoadabledComponent } from 'components/loading';
import {
  LocalStorageVars,
  localStorageService,
} from 'services/LocalStorage';

interface ButtonFilters {
  showButtonTypes: string[];
  bounds: Bounds;
}

function Explore({ router }) {
  const mapBondsButtons = useRef(
    store,
    (state: GlobalState) => state.explore.mapBondsButtons,
  );
  const currentButton = useRef(
    store,
    (state: GlobalState) => state.explore.currentButton,
  );
  const mapZoom = useRef(
    store,
    (state: GlobalState) => state.explore.mapZoom,
  );
  const mapCenter = useRef(
    store,
    (state: GlobalState) => state.explore.mapCenter,
  );
  const showLeftColumn = useRef(
    store,
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
          store.emit(new ButtonsFound(rs));
        } else {
          console.error('error getting buttons?!');
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

  const defaultFilters: ButtonFilters = {
    showButtonTypes: buttonTypes.map((buttonType) => buttonType.name),
    bounds: null,
  };
  const [filteredButtons, setFilteredButtons] = useState([]);
  const [filters, setFilters] =
    useState<ButtonFilters>(defaultFilters);

  const onLeftColumnToggle = (data) => {
    store.emit(new updateShowLeftColumn(!showLeftColumn));
  };

  const handleBoundsChange = (bounds, center: Point, zoom) => {
    localStorageService.save(
      LocalStorageVars.EXPLORE_SETTINGS,
      JSON.stringify({ bounds, center, zoom, currentButton }),
    );

    const getButtonsForBounds = (bounds: Bounds) => {
      setFilters({ ...filters, bounds: bounds });
      sub.next(
        JSON.stringify({
          networkId: selectedNetwork.id,
          bounds: bounds,
        }),
      );
    };
    getButtonsForBounds(bounds);
  };

  const updateFiltersType = (type: string, value: boolean) => {
    const showButtonType = (type: string) => {
      const newButtonTypes = filters.showButtonTypes.filter(
        (name) => name != type,
      );
      if (filters.showButtonTypes.indexOf(type) > -1) {
        return filters; // nothing to do
      }
      newButtonTypes.push(type);

      setFilters({ ...filters, showButtonTypes: newButtonTypes });
    };

    const hideButtonType = (type: string) => {
      const newButtonTypes = filters.showButtonTypes.filter(
        (name) => name != type,
      );
      setFilters({ ...filters, showButtonTypes: newButtonTypes });
    };

    if (value) {
      showButtonType(type);
    } else {
      hideButtonType(type);
    }
  };

  const applyButtonFilters = (buttons, filters) => {
    setFilteredButtons(
      buttons.filter((button: Button) => {
        return filters.showButtonTypes.indexOf(button.type) > -1;
      }),
    );

    if (
      currentButton &&
      filters.showButtonTypes.indexOf(currentButton.type) < 0
    ) {
      store.emit(new updateCurrentButton(null));
    }
  };

  useEffect(() => {
    if (selectedNetwork) {
      store.emit(
        new updateMapCenter(selectedNetwork.location.coordinates),
      );
      store.emit(new updateExploreMapZoom(selectedNetwork.zoom));
    }

    const exploreSettings = localStorageService.read(
      LocalStorageVars.EXPLORE_SETTINGS,
    );
    if (exploreSettings && exploreSettings.length > 0) {
      const { center, zoom, currentButton } =
        JSON.parse(exploreSettings);
      store.emit(new updateMapCenter(center));
      store.emit(new updateExploreMapZoom(zoom));
      if (currentButton)
        store.emit(new updateCurrentButton(currentButton));
    }

    if (router && router.query && router.query.lat) {
      const lat = parseFloat(router.query.lat);
      const lng = parseFloat(router.query.lng);
      store.emit(new updateMapCenter([lat, lng]));
      if (router.query.zoom > 0) {
        const queryZoom = parseFloat(router.query.zoom);
        store.emit(new updateExploreMapZoom(queryZoom));
      }
    }
  }, [selectedNetwork, router]);

  useEffect(() => {
    if (mapBondsButtons && filters) {
      applyButtonFilters(mapBondsButtons, filters);
    }
  }, [mapBondsButtons, filters]);

  const handleSelectedPlace = (place) => {
    store.emit(
      new updateMapCenter([place.geometry.lat, place.geometry.lng]),
    );
    store.emit(new updateExploreMapZoom(16));
  };

  return (
    <>
    {selectedNetwork && 
      <LoadabledComponent loading={ !selectedNetwork}>

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
            mapDefaultCenter={mapCenter}
            mapDefaultZoom={mapZoom}
            filteredButtons={filteredButtons}
            currentButton={currentButton}
            handleBoundsChange={handleBoundsChange}
            tileType={selectedNetwork.tiletype}
          />
        </div>
      </LoadabledComponent>
      }
    </>
  );
}

export default withRouter(Explore);
