import t from 'i18n';
import { GlobalState, store } from 'pages';
import { formatCurrency } from 'shared/currency.utils';
import { DateTypes, readableDateTime } from 'shared/date.utils';
import { Network } from 'shared/entities/network.entity';
import { useStore } from 'store/Store';

export function CardButtonCustomFields({customFields, button})
{
    const selectedNetwork: Network = useStore(
        store,
        (state: GlobalState) => state.networks.selectedNetwork,
      );
      
    const renderFields = () => {
        return customFields.map((fieldProps,key) => {
            
          const type = fieldProps.type;
          let field = (<>{JSON.stringify(fieldProps)}</>)
          if (type == 'price') {
            field = 
                (<>{formatCurrency(button.price, selectedNetwork.currency)}</>)
          }
          if (type == 'event') {
            if(button.eventType == DateTypes.ONCE || button.eventType == DateTypes.MULTIPLE)
            {
              field = (<>
                  <div>{t('eventType.from')}
                  {readableDateTime(button.eventStart)}
                  </div>
                  <div>
                  {t('eventType.until')}
                  {readableDateTime(button.eventEnd)}
                  </div>
                </>)
            }
          }
          return <div key={key}>{field}</div>;
        });
      };
      return <>{selectedNetwork && renderFields()}</>;
}