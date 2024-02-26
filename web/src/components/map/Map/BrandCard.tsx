import React, { useEffect, useState } from 'react';
import { HbMapUncontrolled } from '.';
import { GeoJson, Point } from 'pigeon-maps';
import { latLngToGeoJson } from 'shared/honeycomb.utils';
import { MarkerButtonIcon } from './MarkerButton';
import { cellToLatLng, latLngToCell } from 'h3-js';
import { maxResolution } from 'shared/types/honeycomb.const';
import { useStore } from 'store/Store';
import { GlobalState, store } from 'pages';
import { ShowDesktopOnly } from 'elements/SizeOnly';
import UserAvatar from 'components/user/components';
import NetworkLogo from 'components/network/Components';

export default function BrandCard({
}) {

  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
    false,
  );

  useEffect(() => {
    
  });

  return (
    <>
      <div className="search-map__network-title">
            <ShowDesktopOnly>

              <div className="avatar-medium--home">
                <NetworkLogo network={selectedNetwork} />
              </div>

            </ShowDesktopOnly>

            <div className='search-map__name'>
              {selectedNetwork.name}
              <div className="search-map__sign">
                made with{' '}
                <a href="https://helpbuttons.org">Helpbuttons</a>
              </div>
            </div>
            
            
      </div>
    </>
  );
}
