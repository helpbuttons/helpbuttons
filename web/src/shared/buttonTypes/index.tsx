import { GlobalState, store } from 'state';
import { useStore } from 'state';


export const buttonColorStyle = (cssColor: string) => {
  return { '--button-color': cssColor } as React.CSSProperties;
};

export const useButtonTypes = () => {
  const selectedNetwork = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  return selectedNetwork
  ?.buttonTemplates ? selectedNetwork
  ?.buttonTemplates : []
}

export const showButtonTypeCaption = (typeName) => {
  const buttonTypes = useButtonTypes();
  return buttonTypes?.length > 0 ? buttonTypes.find((elem) => elem.name == typeName).caption : '';
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