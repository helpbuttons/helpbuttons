// //EXPLORE MAP
// import React, { useState, useEffect } from 'react';

// //components
// import {
//   ButtonsFound,
//   setButtonsAndDebounce,
//   updateCurrentButton,
//   updateShowLeftColumn,
// } from 'state/Explore';
// import NavHeader from 'components/nav/NavHeader'; //just for mobile
// import { useRef } from 'store/Store';
// import { GlobalState, store } from 'state';
import { withRouter } from 'next/router';
// import List from 'components/list/List';
// import { buttonTypes } from 'shared/buttonTypes';
// import ExploreMap from 'components/map/Map/ExploreMap';
// import { Button } from 'shared/entities/button.entity';
// import { Bounds, Point } from 'pigeon-maps';
// import { Subject } from 'rxjs';
// import { LoadabledComponent } from 'components/loading';
// import {
//   LocalStorageVars,
//   localStorageService,
// } from 'services/LocalStorage';
// import HexagonExploreMap from 'components/map/Map/HexagonExploreMap';
// import {
//   BrowseType,
//   HbMapTiles,
// } from 'components/map/Map/Map.consts';
// import { getBoundsHexFeatures } from 'shared/honeycomb.utils';

// const defaultZoomPlace = 13;
// interface ButtonFilters {
//   showButtonTypes: string[];
//   bounds: Bounds;
// }


export function ExplorePins({ router }) {
  // const currentButton = useRef(
  //   store,
  //   (state: GlobalState) => state.explore.currentButton,
  // );
  // const showLeftColumn = useRef(
  //   store,
  //   (state: GlobalState) => state.explore.showLeftColumn,
  // );
  // const selectedNetwork = useRef(
  //   store,
  //   (state: GlobalState) => state.networks.selectedNetwork,
  // );

  // const timeInMsBetweenStrokes = 150; //ms
  // const [sub, setSub] = useState(new Subject());
  // const [sub$, setSub$] = useState(
  //   setButtonsAndDebounce(sub, timeInMsBetweenStrokes),
  // );

  // const [exploreSettings, setExploreSettings] = useState(() => {
  //   return {
  //     center: [0, 0],
  //     zoom: 3,
  //     tileType: HbMapTiles.OSM,
  //     // radius: 10000,
  //     bounds: null,
  //     browseType: BrowseType.PINS,
  //     honeyCombFeatures: null,
  //   };
  // });

  // useEffect(() => {
  //   let s = sub$.subscribe(
  //     (rs: any) => {
  //       if (rs) {
  //         store.emit(new ButtonsFound(rs));
  //       } else {
  //         console.error('error getting buttons?!');
  //       }
  //     },
  //     (e) => {
  //       console.log('error subscribe', e);
  //     },
  //   );
  //   return () => {
  //     s.unsubscribe(); //limpiamos
  //   };
  // }, [sub$]); //first time

  // const defaultFilters: ButtonFilters = {
  //   showButtonTypes: buttonTypes.map((buttonType) => buttonType.name),
  //   bounds: null,
  // };
  // const [filteredButtons, setFilteredButtons] = useState([]);
  // const [filters, setFilters] =
  //   useState<ButtonFilters>(defaultFilters);

  // const onLeftColumnToggle = (data) => {
  //   store.emit(new updateShowLeftColumn(!showLeftColumn));
  // };

  // const onBoundsChanged = (bounds, center: Point, zoom) => {
  //   setExploreSettings((prevSettings) => {
  //     const getButtonsForBounds = (bounds: Bounds) => {
  //       sub.next(
  //         JSON.stringify({
  //           bounds: bounds,
  //         }),
  //       );
  //     };
  //     getButtonsForBounds(bounds)
  //     return { ...prevSettings, center, zoom, bounds: bounds };
  //   });
    
  //   setFilters(() => {return { ...filters, bounds: bounds }});
  //   localStorageService.save(
  //     LocalStorageVars.EXPLORE_SETTINGS,
  //     JSON.stringify({ bounds, center, zoom, currentButton }),
  //   );
  // };

  // const updateFiltersType = (type: string, value: boolean) => {
  //   const showButtonType = (type: string) => {
  //     const newButtonTypes = filters.showButtonTypes.filter(
  //       (name) => name != type,
  //     );
  //     if (filters.showButtonTypes.indexOf(type) > -1) {
  //       return filters; // nothing to do
  //     }
  //     newButtonTypes.push(type);

  //     setFilters({ ...filters, showButtonTypes: newButtonTypes });
  //   };

  //   const hideButtonType = (type: string) => {
  //     const newButtonTypes = filters.showButtonTypes.filter(
  //       (name) => name != type,
  //     );
  //     setFilters({ ...filters, showButtonTypes: newButtonTypes });
  //   };

  //   if (value) {
  //     showButtonType(type);
  //   } else {
  //     hideButtonType(type);
  //   }
  // };

  // const applyButtonFilters = (buttons, filters) => {
  //   // console.log('applying filters...')
    
  //   setFilteredButtons(() =>
  //     {
  //       if(!buttons){
  //         return []
  //       } 
  //       return buttons.filter((button: Button) => {
  //         return filters.showButtonTypes.indexOf(button.type) > -1;
  //       })
  //     }
  //   );

  //   // if (
  //   //   currentButton &&
  //   //   filters.showButtonTypes.indexOf(currentButton.type) < 0
  //   // ) {
  //   //   store.emit(new updateCurrentButton(null));
  //   // }
  // };

  // const setMapCenter = (latLng) => {
  //   setExploreSettings((prevSettings) => {
  //     console.log('changing map center...');
  //     return { ...prevSettings, center: latLng };
  //   });
  // };
  // useEffect(() => {
  //   const exploreSettings = localStorageService.read(
  //     LocalStorageVars.EXPLORE_SETTINGS,
  //   );
  //   if (router && router.query && router.query.lat) {
  //     const lat = parseFloat(router.query.lat);
  //     const lng = parseFloat(router.query.lng);
  //     return;
  //     setExploreSettings((prevSettings) => {
  //       return { ...prevSettings, center: [lat, lng] };
  //     });
  //     if (router.query.zoom > 0) {
  //       setExploreSettings((prevSettings) => {
  //         return { ...prevSettings, zoom: router.query.zoom };
  //       });
  //     }
  //     console.log('loading from router...');
  //     // }else if (exploreSettings && exploreSettings.length > 0) {
  //     //   const { center, zoom, currentButton } =
  //     //     JSON.parse(exploreSettings);
  //     //     setMapZoom(() => zoom)
  //     //     setMapCenter(() => center)

  //     //   if (currentButton){
  //     //     store.emit(new updateCurrentButton(currentButton));
  //     //     setMapCenter(currentButton.location)
  //     //   }
  //     //   console.log('loading from exploresettings...')
  //   } else if (selectedNetwork) {
  //     setExploreSettings((prevSettings) => {
  //       console.log('loading from selectedNetwork');
  //       return {
  //         ...prevSettings,
  //         ...selectedNetwork.exploreSettings,
  //       };
  //     });
  //   }
  // }, [selectedNetwork, router]);

  // useEffect(() => {
  //   console.log(buttonsBounds)
  //   applyButtonFilters(buttonsBounds, filters);
  // }, [buttonsBounds]);

  // const handleSelectedPlace = (place) => {
  //   setExploreSettings((prevSettings) => {
  //     console.log('handleSelectedPlace');
  //     return {
  //       ...prevSettings,
  //       center: [place.geometry.lat, place.geometry.lng],
  //       zoom: defaultZoomPlace,
  //     };
  //   });
  // };

  return (
    <>
      {/* <div className="index__container">
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
          exploreSettings={exploreSettings}
          filteredButtons={filteredButtons}
          currentButton={currentButton}
          handleBoundsChange={onBoundsChanged}
          setMapCenter={setMapCenter}
        />
      </div> */}
    </>
  );
}

export default withRouter(ExplorePins);
