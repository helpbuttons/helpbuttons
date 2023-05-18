//EXPLORE MAP
import React, { useState, useEffect } from 'react';

//components
import {
  FindButtons,
  updateCurrentButton,
  updateShowLeftColumn,
} from 'state/Explore';
import NavHeader from 'components/nav/NavHeader'; //just for mobile
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { withRouter } from 'next/router';
import List from 'components/list/List';
import { buttonTypes } from 'shared/buttonTypes';
import { Button } from 'shared/entities/button.entity';
import { Bounds, Point } from 'pigeon-maps';
import { LoadabledComponent } from 'components/loading';
import {
  LocalStorageVars,
  localStorageService,
} from 'services/LocalStorage';
import HexagonExploreMap from 'components/map/Map/HexagonExploreMap';
import { cellToParent} from 'h3-js';
import {
  getResolution,
} from 'shared/honeycomb.utils';
import _ from 'lodash';
import {
  BrowseType,
  HbMapTiles,
} from 'components/map/Map/Map.consts';
import { getAreaOfPolygon } from 'geolib';
import { useDebounce } from 'shared/custom.hooks';

const defaultZoomPlace = 13;
interface ButtonFilters {
  showButtonTypes: string[];
  bounds: Bounds;
}

function HoneyComb({ router }) {
  const [exploreSettings, setExploreSettings] = useState(() => {
    return {
      center: [0, 0],
      zoom: 4,
      tileType: HbMapTiles.OSM,
      // radius: 10000,
      bounds: null,
      browseType: BrowseType.PINS,
      honeyCombFeatures: null,
      prevZoom: 0,
      loading: true,
    };
  });

  const timeInMsBetweenStrokes = 100; //ms
  const [hexagonClicked, setHexagonClicked] = useState();
  const [hexagonsToFetch, setHexagonsToFetch] = useState({
    resolution: 1,
    hexagons: [],
  });
  const debounceHexagonsToFetch = useDebounce(hexagonsToFetch, timeInMsBetweenStrokes);
  const [fetchedButtons, setFetchedButtons] = useState([]);
  const [isFetchingButton, setIsFetchingButtons] = useState(false);

  useEffect(
    () => {
      if (debounceHexagonsToFetch) {
        setIsFetchingButtons(true);
        store.emit(
          new FindButtons(
            debounceHexagonsToFetch.resolution,
            debounceHexagonsToFetch.hexagons,
            (buttons) => {
              setIsFetchingButtons(() => false);
              setFetchedButtons(() => buttons);
            },
            (error) => {
              setFetchedButtons([]);
              setIsFetchingButtons(false);
            },
          ),
        );
      } else {
        setFetchedButtons([]);
        setIsFetchingButtons(false);
      }
    },
    [debounceHexagonsToFetch],
  );

  const currentButton = useRef(
    store,
    (state: GlobalState) => state.explore.currentButton,
  );
  const showLeftColumn = useRef(
    store,
    (state: GlobalState) => state.explore.showLeftColumn,
  );
  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );


  const defaultFilters: ButtonFilters = {
    showButtonTypes: buttonTypes.map((buttonType) => buttonType.name),
    bounds: null,
  };
  const [filteredButtons, setFilteredButtons] = useState([]);
  const [listButtons, setListButtons] = useState([]);
  const [filters, setFilters] =
    useState<ButtonFilters>(defaultFilters);

  const onLeftColumnToggle = (data) => {
    store.emit(new updateShowLeftColumn(!showLeftColumn));
  };

  const handleBoundsChange = (bounds, center: Point, zoom) => {
    setExploreSettings((previousExploreSettings) => {
      return {
        ...previousExploreSettings,
        prevZoom: previousExploreSettings.zoom,
        zoom: zoom,
        bounds: bounds,
        center: center,
      };
    });
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

  const setMapCenter = (latLng) => {
    setExploreSettings((prevSettings) => {
      return { ...prevSettings, center: latLng };
    });
  };

  const setMapZoom = (zoom) => {
    setExploreSettings((prevSettings) => {
      return { ...prevSettings, zoom };
    });
  };

  useEffect(() => {
    const exploreSettings = localStorageService.read(
      LocalStorageVars.EXPLORE_SETTINGS,
    );
    if (router && router.query && router.query.lat) {
      const lat = parseFloat(router.query.lat);
      const lng = parseFloat(router.query.lng);
      return;
      setExploreSettings((prevSettings) => {
        return { ...prevSettings, center: [lat, lng] };
      });
      if (router.query.zoom > 0) {
        setExploreSettings((prevSettings) => {
          return { ...prevSettings, zoom: router.query.zoom };
        });
      }
      console.log('loading from router...');
      // }else if (exploreSettings && exploreSettings.length > 0) {
      // LOAD explore zoom and center from storage...?!
      //   const { center, zoom, currentButton } =
      //     JSON.parse(exploreSettings);
      //     setMapZoom(() => zoom)
      //     setMapCenter(() => center)

      //   if (currentButton){
      //     store.emit(new updateCurrentButton(currentButton));
      //     setMapCenter(currentButton.location)
      //   }
      //   console.log('loading from exploresettings...')
    } else if (selectedNetwork) {
      console.log('load from network');
      setExploreSettings((prevSettings) => {
        return {
          ...prevSettings,
          ...selectedNetwork.exploreSettings,
          loading: false,
        };
      });
    }
  }, [selectedNetwork, router]);

  useEffect(() => {
    setFilteredButtons(() =>
    fetchedButtons.filter((button: Button) => {
        return filters.showButtonTypes.indexOf(button.type) > -1;
      }),
    );
    if (
      currentButton &&
      filters.showButtonTypes.indexOf(currentButton.type) < 0
    ) {
      store.emit(new updateCurrentButton(null));
    }

    if (hexagonClicked) {
      setListButtons(() => {
        return filteredButtons.filter(
          (button: Button) =>
            hexagonClicked &&
            cellToParent(
              button.hexagon,
              getResolution(exploreSettings.zoom),
            ) == hexagonClicked,
        );
      });
    } else {
      setListButtons(() => filteredButtons.slice(0, 20));
      // TODO HERE SHOULD LOAD AS SOON AS THE USER SCROLLS!
    }
  }, [fetchedButtons, filters, hexagonClicked]);

  const handleSelectedPlace = (place) => {
    setMapCenter([place.geometry.lat, place.geometry.lng]);
    setMapZoom(defaultZoomPlace);
  };

  return (
    <>
      <>
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
              buttons={listButtons}
              showLeftColumn={showLeftColumn}
              onLeftColumnToggle={onLeftColumnToggle}
            />
          </div>
          <LoadabledComponent loading={exploreSettings.loading}>
            <HexagonExploreMap
              exploreSettings={exploreSettings}
              filteredButtons={filteredButtons}
              currentButton={currentButton}
              handleBoundsChange={handleBoundsChange}
              setMapCenter={setMapCenter}
              setHexagonsToFetch={setHexagonsToFetch}
              setHexagonClicked={setHexagonClicked}
              hexagonClicked={hexagonClicked}
            />
          </LoadabledComponent>
        </div>
      </>
    </>
  );
}

export default withRouter(HoneyComb);
