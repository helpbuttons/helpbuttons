import { FieldCheckbox } from "elements/Fields/FieldCheckbox";
import t from "i18n";
import { useEffect } from "react";

export function AddCustomFields({ register, watch, setCustomFields }) {

    const priceField = watch('priceField')
    useEffect(() => {
      let customFields = [];
  
      if(priceField)
      {
        customFields.push({type: 'price'})
      }
      setCustomFields(() => customFields)
    }, [priceField])
    return (
      <>
        <FieldCheckbox
          name="priceField"
          checked={priceField}
          text={t('configuration.priceFieldAdd')}
          onChanged={(value) => {}}
          {...register('priceField')}
        />
      </>
    );
  }
  