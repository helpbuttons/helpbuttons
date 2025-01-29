import { FieldCheckbox } from 'elements/Fields/FieldCheckbox';
import FieldDate from 'elements/Fields/FieldDate';
import FieldNumber, { InputNumber } from 'elements/Fields/FieldNumber';
import t from 'i18n';
import React, { useEffect } from 'react';

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
        field = <FieldPrice price={watch('price')} currency={currency} watch={watch} setValue={setValue} setFocus={setFocus} errors={errors} register={register} />

      }
      if (type == 'event') {
        field = (
          <>
            <FieldDate
              eventType={watch('eventType')}
              setEventType={(value) => setValue('eventType', value)}
              eventStart={watch('eventStart')}
              eventEnd={watch('eventEnd')}
              eventData={watch('eventData')}
              setEventData={(value) => setValue('eventData', value)}
              setEventStart={(value) => setValue('eventStart', value)}
              setEventEnd={(value) => {
                setValue('eventEnd', value);
              }}
              title={t('button.whenLabel')}
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

function FieldPrice({
  price,
  currency,
  watch,
  setValue,
  setFocus,
  errors,
  register,
}) {
  useEffect(() => {
    if (price !== 0 && !price) {
      setValue('price', 0);
    }
  }, []);
  return (
    <>
      <label className="form__label">
        {t('customFields.priceLabel', [currency])}
      </label>
      <FieldCheckbox
        name="consultPrice"
        defaultValue={price < 0}
        text={t('customFields.consult')}
        onChanged={(value) => {
          setValue('price', value ? '-1' : '0');
        }}
        {...register('consultPrice')}
      />
      {price != -1 && (
        <InputNumber name={'price'} validationError={errors.price}
          watch={watch}
          {...register('price', {
            required: true,
            valueAsNumber: true,
          })}
        />
      )}
    </>
  );
}