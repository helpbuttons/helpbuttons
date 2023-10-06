import { FieldCheckbox } from 'elements/Fields/FieldCheckbox';
import t from 'i18n';
import { useForm } from 'react-hook-form';

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
      <FieldCheckbox
        name="priceField"
        defaultValue={watch('priceField')}
        text={t('configuration.priceFieldAdd')}
        onChanged={(value) => updateCustomField('price', value)}
        {...register('priceField')}
      />
      <FieldCheckbox
        name="eventField"
        defaultValue={watch('eventField')}
        text={t('configuration.eventFieldAdd')}
        onChanged={(value) => updateCustomField('event', value)}
        {...register('eventField')}
      />
    </>
  );
}
