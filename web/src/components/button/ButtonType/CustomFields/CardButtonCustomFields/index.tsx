import { GlobalState, store } from 'pages';
import { formatCurrency } from 'shared/currency.utils';
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
          return <div key={key}>{field}</div>;
        });
      };
      return <>{selectedNetwork && renderFields()}</>;
}