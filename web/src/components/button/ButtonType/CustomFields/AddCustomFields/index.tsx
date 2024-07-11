import { FieldCheckCard } from 'elements/Fields/FieldCheckCard';
import { FieldCheckbox } from 'elements/Fields/FieldCheckbox';
import t from 'i18n';
import { useForm } from 'react-hook-form';
import { IoAccessibility, IoCalendar, IoCash } from 'react-icons/io5';

export function AddCustomFields({ setCustomFields }) {
  const { watch, register } = useForm({});
  
  const updateCustomField = (fieldType,value) => {
    if (value) {
      setCustomFields((prevCustomFields) => {
        const newCustomFields = [...prevCustomFields];
        newCustomFields.push({ type: fieldType })
        return newCustomFields
      })
    } else {
      setCustomFields((prevCustomFields) => {
        if(!prevCustomFields)
        {
          return []
        }
        return prevCustomFields.filter((customField) => customField.type != fieldType)
      })
    }
  };

  return (
    <>
      <FieldCheckCard
        name="priceField"
        image={<IoCash/>}
        explain={t('configuration.priceFieldAddLabel')}
        defaultValue={watch('priceField')}
        text={t('configuration.priceFieldAdd')}
        onChanged={(value) => updateCustomField('price', value)}
        {...register('priceField')}
      />
      <FieldCheckCard
        name="eventField"
        image={<IoCalendar/>}
        explain={t('configuration.dateFieldAddLabel')}
        defaultValue={watch('eventField')}
        text={t('eventType.eventFieldAdd')}
        onChanged={(value) => updateCustomField('event', value)}
        {...register('eventField')}
      />
    </>
  );
}
