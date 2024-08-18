import { FieldCheckbox } from 'elements/Fields/FieldCheckbox';
import t from 'i18n';
import { useForm } from 'react-hook-form';

export function AddCustomFields({ customFields, setCustomFields }) {
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
      <FieldCheckbox
        name="eventField"
        explain={t('configuration.dateFieldAddLabel')}
        defaultValue={watch('eventField')}
        text={t('eventType.eventFieldAdd')}
        onChanged={(value) => updateCustomField('event', value)}
        {...register('eventField')}
      />
      <FieldCheckbox
        name="priceField"
        explain={t('configuration.priceFieldAddLabel')}
        defaultValue={watch('priceField')}
        text={t('configuration.priceFieldAdd')}
        onChanged={(value) => updateCustomField('price', value)}
        {...register('priceField')}
      />
    </>
  );
}
