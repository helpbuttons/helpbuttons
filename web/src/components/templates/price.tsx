import t from "i18n";
import { IoCash } from "react-icons/io5";
import { CustomTemplate } from ".";
import { useEffect, useState } from "react";
import { FieldCheckbox } from "elements/Fields/FieldCheckbox";
import { InputNumber } from "elements/Fields/FieldNumber";
import FieldError from "elements/Fields/FieldError";
import { useSelectedNetwork } from "state/Networks";
import { formatCurrency } from "shared/currency.utils";

export const priceTemplate : CustomTemplate = {
    icon: <IoCash/>,
    explain: t('customTemplates.priceExplain'),
    text: t('customTemplates.priceText'),
    name: 'price',
    templateField: FieldPrice,
    configurationForm: null,
    fieldView: FieldPriceView,
}

export function FieldPriceView({button, selectedNetwork}) {
  if(button.price < 0)
    {
      return (
      <div className='card-button__price'>
          {t('customFields.consult')}
        </div>
      )
    }else if(button.price == 0)
    {
      return (
      <div className='card-button__price'>
          {t('customFields.free')}
        </div>
      )
    }
    return (
      <div className='card-button__price'>
        {formatCurrency(button.price, selectedNetwork.currency)}
      </div>
    );
}

export function FieldPrice({
    watch,
    setValue,
    setFocus,
    register,
    validationError
  }) {
    const price = watch(priceTemplate.name)
    useEffect(() => {
      if (price !== 0 && !price) {
        setValue(priceTemplate.name, 0);
      }
    }, []);
    const selectedNetwork = useSelectedNetwork()
    const [currency, setCurrency] = useState('')
    useEffect(() => {
      setCurrency(() => selectedNetwork.currency)
    } ,[selectedNetwork])
    return (
      <>
        <label className="form__label">
          {t('customFields.priceLabel', [currency])}
        </label>
        <p className="form__explain">
            {t('customFields.priceExplain')}
          </p>
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
          <InputNumber name={'price'}
            watch={watch}
            {...register('price', {
              required: true,
              valueAsNumber: true,
            })}
          />
        )}
        <FieldError validationError={validationError} />
      </>
    );
  }

export default FieldPrice;