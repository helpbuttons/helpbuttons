import FieldNumber from 'elements/Fields/FieldNumber';
import t from 'i18n';
import React, { useEffect } from 'react';
import { getSymbol } from 'shared/currency.utils';

// export default function CustomFields({ fields, register, setValue, watch, setFocus}) {
export default function FieldCustomFields({ customFields, watch, setValue, setFocus, register, errors, currency}) {

  const renderFields = () => {
    return customFields.map((fieldProps,key) => {
        
      const type = fieldProps.type;
      let field = (<>{JSON.stringify(fieldProps)}</>)
      if (type == 'price') {
        field = 
            (<><FieldNumber
                name={type}
                label={t('customFields.priceLabel', getSymbol(currency))}
                watch={watch}
                setValue={setValue}
                setFocus={setFocus}
                validationError={errors.price}
                {...register('price', { required: true,
                    valueAsNumber: true
                  })}
            /></>)
      }
      return <div key={key}>{field}</div>;
    });
  };
  return <>{renderFields()}</>;
}