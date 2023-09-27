import FieldText from 'elements/Fields/FieldText';
import t from 'i18n';
import _ from 'lodash';
import { Button } from 'shared/entities/button.entity';

export function AdvancedFiltersCustomFields({ buttonTypes, register }) {
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
              label={t('buttonFilters.minPriceLabel')}
              {...register('minPrice')}
            />
            <FieldText
              name="maxPrice"
              label={t('buttonFilters.maxPriceLabel')}
              {...register('maxPrice')}
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
    return true;
}
