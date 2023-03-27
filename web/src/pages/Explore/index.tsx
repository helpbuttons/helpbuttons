//EXPLORE MAP
import React, { useState, useEffect, useCallback } from 'react';
import { AutoSizer } from 'react-virtualized';

//components
import { FindButtons, SetAsCurrentButton } from 'state/Explore';
import NavHeader from 'components/nav/NavHeader'; //just for mobile
import { useRef } from 'store/Store';
import { GlobalState, store } from 'pages';
import { Bounds } from 'leaflet';
import { useRouter } from 'next/router';
import List from 'components/list/List';
import { buttonTypes } from 'shared/buttonTypes';
import ExploreMap from 'components/map/Map/ExploreMap';

export default function Explore() {
  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  const mapBondsButtons = useRef(
    store,
    (state: GlobalState) => state.explore.mapBondsButtons,
  );

  const router = useRouter();

  let lat = 0;
  let lng = 0;
  let zoom = 2;

  if (selectedNetwork) {
    lat = selectedNetwork.location.coordinates[0];
    lng = selectedNetwork.location.coordinates[1];
    zoom = selectedNetwork.zoom;
  }
  if (router && router.query && router.query.lat) {
    lat = router.query.lat;
    lng = router.query.lng;
    zoom = 13;
  }

  const [showLeftColumn, setShowLeftColumn] = useState(null);
  const [filteredButtons, setFilteredButtons] = useState([]);

  const [buttonFilterTypes, setButtonFilterTypes] = useState(
    buttonTypes.map((buttonType) => buttonType.name),
  );

  const onLeftColumnToggle = (data) => {
    setShowLeftColumn(!showLeftColumn);
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
    if (mapBondsButtons !== null)
      setFilteredButtons(
        mapBondsButtons.filter((button: Button) => {
          return buttonFilterTypes.indexOf(button.type) >= 0;
        }),
      );
  }, [mapBondsButtons, buttonFilterTypes]);

  const onMarkerClick = (buttonId) => {
    store.emit(new SetAsCurrentButton(buttonId));
  };

  const refCallback = useCallback((ref, width) => {
    if (ref) {
      if (width > 450) {
        setShowLeftColumn(true);
      } else {
        setShowLeftColumn(false);
      }
    }
  }, []);

  return (
    <>
      {/* {({ width, height }) => <div>{`${width}x${height}`}</div>} */}
      {selectedNetwork && (
        <div className="index__container">
          <AutoSizer>
            {({ width, height }) => (
              <div
                ref={(ref) => refCallback(ref, width)}
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
            )}
          </AutoSizer>

          <ExploreMap
            center={[
              selectedNetwork.latitude,
              selectedNetwork.longitude,
            ]}
            markers={filteredButtons}
            handleBoundsChange={(bounds) => {
              updateButtons(bounds);
            }}
            defaultZoom={selectedNetwork.zoom}
          />
        </div>
      )}
    </>
  );
}
