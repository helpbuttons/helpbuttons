import { findCustomTemplate } from 'components/templates';
import React from 'react';

export default function FieldCustomFields(
props) {

  const renderFields = () => {
    return props?.customFields.map((fieldProps, key) => {
      const type = fieldProps.type;
      const FieldComponent = findCustomTemplate(type)?.templateField;
      
      if (!FieldComponent) {
        return <div key={key}>{JSON.stringify(fieldProps)}</div>;
      }

      return (
        <div key={key}>
          <FieldComponent {...props} {...fieldProps} />
        </div>
      );
    });
  };

  return <>{renderFields()}</>;
}