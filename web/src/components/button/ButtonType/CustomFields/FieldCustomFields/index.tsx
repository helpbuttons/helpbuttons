import { FieldCheckbox } from 'elements/Fields/FieldCheckbox';
import FieldDate from 'elements/Fields/FieldDate';
import FieldNumber from 'elements/Fields/FieldNumber';
import t from 'i18n';
import React from 'react';
import { getSymbol } from 'shared/currency.utils';

export default function FieldCustomFields({
  customFields,
  watch,
  setValue,
  setFocus,
  register,
  errors,
  currency,
}) {
  const renderFields = () => {
    return customFields.map((fieldProps, key) => {
      const type = fieldProps.type;
      let field = <>{JSON.stringify(fieldProps)}</>;
      if (type == 'price') {
        const price = watch('price');
        field = (
          <>
            {price != -1 && (
              <FieldNumber
                name={'price'}
                label={t(
                  'customFields.priceLabel',
                  getSymbol(currency),
                )}
                watch={watch}
                setValue={setValue}
                setFocus={setFocus}
                validationError={errors.price}
                {...register('price', {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            )}
            <FieldCheckbox
              name="consultPrice"
              defaultValue={price < 0}
              text={t('customFields.consult')}
              onChanged={(value) => {
                setValue('price', value ? '-1' : '0');
              }}
              {...register('consultPrice')}
            />
          </>
        );
      }
      if (type == 'event') {
        field = (
          <>
            <FieldDate
              eventType={watch('eventType')}
              setEventType={(value) => setValue('eventType', value)}
              eventStart={watch('eventStart')}
              eventEnd={watch('eventEnd')}
              setEventStart={(value) => setValue('eventStart', value)}
              setEventEnd={(value) => {
                setValue('eventEnd', value);
              }}
              title={t('button.whenLabel')}
              isUTC={!!watch('id')}
              register={register}
            />
          </>
        );
      }
      return <div key={key}>{field}</div>;
    });
  };

  return <>{renderFields()}</>;
}