import { FieldCheckCard } from 'elements/Fields/FieldCheckCard';
import t from 'i18n';
import { IoCalendar, IoCash } from 'react-icons/io5';
import _ from 'lodash';

export function AddCustomFields({ customFields, setCustomFields }) {
  const hasPrice = customFields.find(
    (customField) => customField.type == 'price',
  );
  const hasEvent = customFields.find(
    (customField) => customField.type == 'event',
  );
  return (
    <>
      {customFields && (
        <>
          <FieldCheckCard
            name="priceField"
            image={CustomFieldIcon['price']}
            explain={t('configuration.priceFieldAddLabel')}
            text={t('configuration.priceFieldAdd')}
            onChanged={(value) => {
              if (value) {
                setCustomFields(
                  _.uniq([...customFields, { type: 'price' }]),
                );
              } else {
                setCustomFields(
                  customFields.filter((elem) => elem.type != 'price'),
                );
              }
            }}
            defaultValue={hasPrice}
          />
          <FieldCheckCard
            name="eventField"
            image={CustomFieldIcon['event']}
            explain={t('configuration.dateFieldAddLabel')}
            // defaultValue={watch('eventField')}
            text={t('eventType.eventFieldAdd')}
            onChanged={(value) => {
              if (value) {
                setCustomFields(
                  _.uniq([...customFields, { type: 'event' }]),
                );
              } else {
                setCustomFields(
                  customFields.filter((elem) => elem.type != 'event'),
                );
              }
            }}
            defaultValue={hasEvent}
          />
        </>
      )}
    </>
  );
}

export const CustomFieldIcon = {
  'price': <IoCash/>,
  'event': <IoCalendar/>,
};
