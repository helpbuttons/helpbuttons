import { useEffect, useState } from 'react';
import { CustomFields } from 'shared/types/customFields.type';
import { useSelectedNetwork } from 'state/Networks';


export const buttonColorStyle = (cssColor: string) => {
  return { '--button-color': cssColor } as React.CSSProperties;
};

export const useButtonTypes = () => {
  const [buttonTemplates, setButtonTemplates] = useState([])
  const selectedNetwork = useSelectedNetwork()
  useEffect(() => {
    if(selectedNetwork.buttonTemplates){
      setButtonTemplates(() => selectedNetwork.buttonTemplates.filter((_btnTemplate) => !_btnTemplate.hide))
    }
  }, [selectedNetwork.buttonTemplates])
  return buttonTemplates;
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
  if(!btnType?.customFields)
  {
    return false;
  }
  return btnType.customFields.find((field) => field.type == CustomFields.Event)
}

export const isEventAndIsExpired = (button) => {
  const isEvent = isButtonTypeEvent(button.type);

  if(isEvent && new Date(button.eventEnd) < new Date())
  { 
    return true;
  }
  return false;
}
export const useButtonType = (button,buttonTypes) => {
  const [buttonType, setButtonType] = useState({cssColor: 'pink', caption: 'caption', name: 'name', customFields: [], icon: ''});
  useEffect(() => {
    if(buttonTypes && button)
    {
      setButtonType(() =>
        buttonTypes.find(
          (buttonType) => buttonType.name == button.type,
        ),
      );
    }
  }, [buttonTypes, button]);
  return buttonType;
}

