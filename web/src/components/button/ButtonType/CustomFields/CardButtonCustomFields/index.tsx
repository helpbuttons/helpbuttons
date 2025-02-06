import { ShowDate } from 'elements/Fields/FieldDate';
import t from 'i18n';
import _ from 'lodash';
import { GlobalState, store } from 'state';
import { formatCurrency } from 'shared/currency.utils';
import { Network } from 'shared/entities/network.entity';
import { useStore } from 'state';
import { IoTimeOutline } from 'react-icons/io5';

export function CardButtonCustomFields({ customFields, button }) {
  const selectedNetwork: Network = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );

  const renderFields = () => {
    const reversedCustomFields = [...customFields].reverse();
    return reversedCustomFields.map((fieldProps, key) => {
      const type = fieldProps.type;
      let field = <>{JSON.stringify(fieldProps)}</>;
      if (type == 'price') {
        
        if(button.price < 0)
        {
          field = (
          <div className='card-button__price'>
              {t('customFields.consult')}
            </div>
          )
        }else if(button.price == 0)
        {
          field = (
          <div className='card-button__price'>
              {t('customFields.free')}
            </div>
          )
        }else{
          field = (
            <div className='card-button__price'>
              {formatCurrency(button.price, selectedNetwork.currency)}
            </div>
          );
        }
      }

      if (type == 'event') {
        field = (
            <div className='card-button__date'>
              <IoTimeOutline/>
              <ShowDate
                eventStart={button.eventStart}
                eventEnd={button.eventEnd}
                eventType={button.eventType}
                title={button.title}
                eventData={button.eventData}
                hideRecurrentDates={true}
              />
            </div>
            
        );
      }

      return <div className='card-button__custom-field' key={key}>{field}</div>;
    });
  };
  return <>{selectedNetwork && renderFields()}</>;
}
