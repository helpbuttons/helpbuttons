import _ from 'lodash';
import { findCustomTemplate } from 'components/templates';

export function CardButtonCustomFields(props) {
  const renderFields = () => {
    return props?.customFields.map((fieldProps, key) => {
      const type = fieldProps.type;
      const FieldComponent = findCustomTemplate(type)?.fieldView;
      
      if (!FieldComponent) {
        return <div key={key}>{JSON.stringify(fieldProps)}</div>;
      }

      return (
        <div className='card-button__custom-field' key={key}>
          <FieldComponent {...props} {...fieldProps} />
        </div>
      );
    });
  };

  return <>{renderFields()}</>;
}