import t from "i18n";
import { IoCarOutline } from "react-icons/io5";
import { CustomTemplate } from ".";
import { formatCurrency } from "shared/currency.utils";
import { CustomFields } from "shared/types/customFields.type";

export const routeTemplate : CustomTemplate = {
    icon: <IoCarOutline/>,
    explain: t('customTemplates.routeExplain'),
    text: t('customTemplates.routeText'),
    name: CustomFields.Route,
    templateField: FieldRoute,
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

export function FieldRoute({
    watch,
    setValue,
    setFocus,
    register,
    validationError
  }) {
    
    return (
      <>
        this will show links to routes!
      </>
    );
  }

export default FieldRoute;