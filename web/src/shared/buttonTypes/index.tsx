import { useEffect, useState } from 'react';

import { GlobalState, store } from 'pages';
import { Network } from 'shared/entities/network.entity';
import { useStore } from 'store/Store';


export const buttonColorStyle = (cssColor: string) => {
  return { '--button-color': cssColor } as React.CSSProperties;
};

export const useButtonTypes = () => {
  return useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork.buttonTemplates,
  );
}

export const isButtonTypeEvent = (buttonType) => {
  const buttonTypes = useButtonTypes()
  if(!buttonTypes)
  {
    return false;
  }
  const btnType = buttonTypes.find(({name}) => name == buttonType)
  if(!btnType.customFields)
  {
    return false;
  }
  return btnType.customFields.find((field) => field.type == 'event')
}
