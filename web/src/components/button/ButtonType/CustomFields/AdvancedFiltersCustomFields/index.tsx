import FieldText from 'elements/Fields/FieldText';
import t from 'i18n';
import _ from 'lodash';
import Calendar from 'react-calendar';
import { Button } from 'shared/entities/button.entity';
import 'react-calendar/dist/Calendar.css';
import { readableShortDate } from 'shared/date.utils';
import { formatCurrency } from 'shared/currency.utils';
import { useEffect, useState } from 'react';
import { ButtonsOrderBy } from 'components/search/AdvancedFilters';

export function AdvancedFiltersCustomFields({
  buttonTypes,
  register,
  setValue,
  watch,
}) {
  const [customFields, setCustomFields] = useState([]);
  const selectedButtonTypes = watch('helpButtonTypes');

  useEffect(() => {
    if (selectedButtonTypes) {
      const _customFields = getCustomFields(buttonTypes, selectedButtonTypes)
      setCustomFields(() => _customFields);
    }
  }, [selectedButtonTypes]);

    const dateRange = watch('dateRange');
    
    return <>
    {customFields &&
    customFields.map((customField, key) => {
      let field = <></>;
      if (customField == 'price') {
        field = (
          <>
            <FieldText
              name="minPrice"
              label={t('buttonFilters.price')}
              explain={t('buttonFilters.priceExplain')}
              placeholder={t('buttonFilters.minPricePlaceholder')}
              {...register('minPrice')}
            />
            <FieldText
              name="maxPrice"
              placeholder={t('buttonFilters.maxPriceLabel')}
              {...register('maxPrice')}
            />
          </>
        );
      }
      if (customField == 'event') {
        field = (
          <>
          <div className="form__field">
              <label className="form__label">{t('buttonFilters.whenLabel')}</label>
              <p className="form__explain">{t('buttonFilters.whenExplain')}</p>
           <Calendar
                onChange={(newDates) => {
                  setValue('dateRange', newDates);
                }}
                value={dateRange}
                selectRange
              />
              </div>
          </>
        );
      }
      return <div key={key}>{field}</div>;
    })
  }
      </>;
}

export const applyCustomFieldsFilters = (
  button: Button,
  filters,
  buttonTypes,
) => {
  if (filters.minPrice > 0 || filters.maxPrice > 0) {
    const buttonTypesWithPrice = buttonTypes
      .filter((btnType) => {
        if (!btnType.customFields) {
          return false;
        }
        return btnType.customFields.filter(
          (cstmField) => cstmField.type == 'price',
        );
      })
      .map((btnTpe) => btnTpe.name);

    if (buttonTypesWithPrice.indexOf(button.type) < 0) {
      return false;
    }

    if (
      button.price &&
      button.price >= filters.minPrice &&
      button.price <= filters.maxPrice
    ) {
      return true;
    }
  }
  function getDateOnlyDays(dateString, startEnd = 0) {
    // 1 start, 2 end, 0 dont modify
    const newDate = new Date(dateString);
    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();

    if (startEnd == 1) {
      hours = 0;
      minutes = 1;
    }
    if (startEnd == 2) {
      hours = 23;
      minutes = 59;
    }
    const newDatee = new Date(
      newDate.getFullYear(),
      newDate.getMonth(),
      newDate.getDate(),
      hours,
      minutes,
    );

    return newDatee.getTime();
  }
  if (filters.dateRange) {
    const buttonTypesEvent = buttonTypes
      .filter((btnType) => {
        if (!btnType.customFields) {
          return false;
        }
        return btnType.customFields.filter(
          (cstmField) => cstmField.type == 'event',
        );
      })
      .map((btnTpe) => btnTpe.name);

    if (buttonTypesEvent.indexOf(button.type) < 0) {
      return false;
    }

    if (!button.eventStart || !button.eventEnd) {
      return false;
    }

    const start = getDateOnlyDays(button.eventStart);
    const end = getDateOnlyDays(button.eventEnd);
    const filterStart = getDateOnlyDays(filters.dateRange[0], 1);
    const filterEnd = getDateOnlyDays(filters.dateRange[1], 2);

    if (start > filterStart && end < filterEnd) {
      return true;
    }

    if (start < filterStart && end > filterStart) {
      return true;
    }
    if (start > filterStart && start < filterEnd) {
      return true;
    }
    return false;
  }

  return true;
};
export function customFieldsFiltersText(filters, currency) {
  return (
    <>
      {filters.dateRange &&
        ' - ' + readableDateRange(filters.dateRange)}
      {(filters.minPrice || filters.maxPrice) &&
        ' - ' +
          readableFiltersPrice(
            filters.minPrice,
            filters.maxPrice,
            currency,
          )}
    </>
  );
}

function readableFiltersPrice(minPrice, maxPrice, currency) {
  return (
    formatCurrency(minPrice, currency) +
    ' - ' +
    formatCurrency(maxPrice, currency)
  );
}
function readableDateRange(dateRange) {
  return (
    readableShortDate(dateRange[0]) +
    ' - ' +
    readableShortDate(dateRange[1])
  );
}

export const getCustomDropDownOrderBy = (dropdownOptions, buttonTypes, selectedButtonTypes) => 
{
  const _customFields = getCustomFields(buttonTypes, selectedButtonTypes)
  _customFields.map((customField) => {
    if(customField == 'price') {
      dropdownOptions.push({
        value: ButtonsOrderBy.PRICE,
        name: t('buttonFilters.byPrice'),
      })
    }

    if(customField == 'event') {
      dropdownOptions.push({
      value: ButtonsOrderBy.EVENT_DATE,
      name: t('buttonFilters.byEventDate'),
    });
    }
  })
  return dropdownOptions
}

export const orderByPrice = (buttons) => {
  return buttons.filter((button) => button.price > 0).sort((buttonA, buttonB) => buttonA.price > buttonB.price)
}

export const orderByEventDate = (buttons) => {
  return buttons.filter((button) => button.eventStart).sort((buttonA, buttonB) => new Date(buttonA.eventStart) - new Date(buttonB.eventStart))
}

const getCustomFields = (buttonTypes, selectedButtonTypes) => {
  const filteredButtonTypes = buttonTypes.filter((buttonType) => {
      
    if (selectedButtonTypes.indexOf(buttonType.name) > -1) {
      return true;
    }
    return false;
  });
  let _customFields = filteredButtonTypes.map(
    (btnType) => btnType.customFields,
  );
  _customFields = _.flatten(
    _customFields.filter((value) => value),
  );
  _customFields = _.uniq(_customFields.map((value) => value.type));
  return _customFields;
}