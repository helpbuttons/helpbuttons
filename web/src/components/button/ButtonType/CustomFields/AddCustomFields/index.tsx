import { FieldCheckCard } from 'elements/Fields/FieldCheckCard';
import { FieldCheckbox } from 'elements/Fields/FieldCheckbox';
import t from 'i18n';
import { useForm } from 'react-hook-form';
import { IoAccessibility, IoCalendar, IoCash } from 'react-icons/io5';
import _ from 'lodash';

export function AddCustomFields({ customFields, setCustomFields }) {
  const hasPrice = customFields.find((customField) => customField.type == 'price')
  const hasEvent = customFields.find((customField) => customField.type == 'event')
  return (
    <>
      <FieldCheckCard
        name="priceField"
        image={<IoCash />}
        explain={t('configuration.priceFieldAddLabel')}
        text={t('configuration.priceFieldAdd')}
        onChanged={(value) => {
          console.log(value)
          console.log(customFields)
          if (value) {
            setCustomFields(_.uniq([...customFields, {type: 'price'}]));
          }else{
            setCustomFields(customFields.filter((elem) => elem.type != 'price'));
          }
        }}
        defaultValue={hasPrice}
      />
      <FieldCheckCard
        name="eventField"
        image={<IoCalendar />}
        explain={t('configuration.dateFieldAddLabel')}
        // defaultValue={watch('eventField')}
        text={t('eventType.eventFieldAdd')}
        onChanged={(value) => {
          if (value) {
            setCustomFields(_.uniq([...customFields, {type:'event'}]));
          }else{
            setCustomFields(customFields.filter((elem) => elem.type != 'event'));
          }
        }}
        defaultValue={hasEvent}
      />
    </>
  );
}
