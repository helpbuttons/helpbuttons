import FieldText from 'elements/Fields/FieldText';
import t from 'i18n';
import _ from 'lodash';
import Calendar from 'react-calendar';
import { Button } from 'shared/entities/button.entity';
import 'react-calendar/dist/Calendar.css';

export function AdvancedFiltersCustomFields({ buttonTypes, register, setValue, watch }) {
  let customFields = buttonTypes.map(
    (btnType) => btnType.customFields,
  );
  customFields = _.flatten(customFields.filter((value) => value));
  customFields = _.uniq(customFields.map((value) => value.type))

  const renderCustomFilters = () => {
    return customFields.map((customField, key) => {
      let field = <></>
      if (customField == 'price') {
        field = (
          <>
            <FieldText
              name="minPrice"
              label={t('buttonFilters.price')}
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
           <Calendar
                onChange={(newDates) => {
                  setValue('dateRange',newDates)
                }}
                value={watch('dateRange')}
                selectRange
              />
          </>
        );
      }
      return <div key={key}>{field}</div>;
    });
  };
  return <>{renderCustomFilters()}</>;
}

export const applyCustomFieldsFilters = (button: Button, filters, buttonTypes) => {
    if((filters.minPrice > 0) || (filters.maxPrice > 0))
    {
        const buttonTypesWithPrice = buttonTypes.filter((btnType) => {
          if(!btnType.customFields)
          {
            return false
          }
          return btnType.customFields.filter((cstmField) => cstmField.type == 'price')
        }).map((btnTpe) => btnTpe.name)
        
        if(buttonTypesWithPrice.indexOf(button.type) < 0){
          return false;
        }

        if(button.price && button.price >= filters.minPrice && button.price <= filters.maxPrice)
        {
            return true;
        }
    }
    function getDateOnlyDays(dateString, startEnd = 0) // 1 start, 2 end, 0 dont modify
    {
      const newDate = new Date(dateString)
      let hours = newDate.getHours()
      let minutes = newDate.getMinutes()

      if(startEnd == 1)
      {
        hours = 0
        minutes = 1
      }
      if(startEnd == 2)
      {
        hours = 23
        minutes = 59
      }
      const newDatee = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), hours, minutes)

      return newDatee.getTime()
    }
    if((filters.dateRange))
    {
      const buttonTypesEvent = buttonTypes.filter((btnType) => {
        if(!btnType.customFields)
        {
          return false
        }
        return btnType.customFields.filter((cstmField) => cstmField.type == 'event')
      }).map((btnTpe) => btnTpe.name)
      
      if(buttonTypesEvent.indexOf(button.type) < 0){
        return false;
      }

      if(!button.eventStart || !button.eventEnd)
      {
        return false;
      }

      if(getDateOnlyDays(button.eventStart) > getDateOnlyDays(filters.dateRange[0],1) && getDateOnlyDays(button.eventEnd) < getDateOnlyDays(filters.dateRange[1], 2))
      {
        return true;
      }

      return false;
    }

    return true;
}
