import { findCustomTemplate } from 'components/templates';
import { CustomFields } from 'shared/types/customFields.type';
import React from 'react';

export default function FieldCustomFields(
props) {

  const renderFields = () => {
    //set sheduler as last field of the form
    const sortedFields = [...(props?.customFields ?? [])].sort((a, b) => {
      if (a.type === CustomFields.Scheduler) return 1;
      if (b.type === CustomFields.Scheduler) return -1;
      return 0;
    });
    return sortedFields.map((fieldProps, key) => {
      const type = fieldProps.type;
      const FieldComponent = findCustomTemplate(type)?.templateField;
      
      if (!FieldComponent) {
        return <div key={key}>{JSON.stringify(fieldProps)}</div>;
      }

      return (
        <div className="form__field" key={key}>
          <FieldComponent {...props} {...fieldProps} />
        </div>
      );
    });
  };

  return <>{renderFields()}</>;
}