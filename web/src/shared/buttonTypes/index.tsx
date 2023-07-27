import { useEffect, useState } from 'react';

import { GlobalState, store } from 'pages';
import { Network } from 'shared/entities/network.entity';
import { useStore } from 'store/Store';


export const buttonColorStyle = (cssColor: string) => {
  return { '--button-color': cssColor } as React.CSSProperties;
};


export const useButtonTypes = (setButtonTypes) => {
  const selectedNetwork: Network = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  useEffect(() => {
    if (selectedNetwork) {
      setButtonTypes(() => selectedNetwork.buttonTemplates
      );
    }
  }, [selectedNetwork]);
};