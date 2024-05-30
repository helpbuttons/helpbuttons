import { GlobalState, store } from 'pages';
import { useStore } from 'store/Store';


export const buttonColorStyle = (cssColor: string) => {
  return { '--button-color': cssColor } as React.CSSProperties;
};

export const useButtonTypes = () => {
  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  return selectedNetwork ? selectedNetwork.buttonTemplates : []
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

export const isEventAndIsExpired = (button) => {
  const isEvent = isButtonTypeEvent(button.type);

  if(isEvent && new Date(button.eventEnd) < new Date())
  { 
    return true;
  }
  return false;
}