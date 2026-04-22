import { FieldCheckCard } from 'elements/Fields/FieldCheckCard';
import _ from 'lodash';
import { customTemplates } from 'components/templates';



export function AddCustomFields({ selectedCustomTemplates, setSelectedCustomTemplates, setEditing, editingValue, saveEdit }) {
  
  return <>{customTemplates
            .map((template) => {
              const isSelected = selectedCustomTemplates?.find((_template) => {return _template.type == template.name})
              const FormConfiguration = template.configurationForm;
              return <>
              <FieldCheckCard
                name={`${template.name}Field`}
                image={template.icon}
                explain={template.explain}
                text={template.text}
                onChanged={(value) => {
                  if (value) {
                    setSelectedCustomTemplates(
                      _.uniq([...selectedCustomTemplates, { type: template.name }]),
                    );
                  } else {
                    setSelectedCustomTemplates(
                      selectedCustomTemplates.filter((elem) => elem.type != template.name),
                    );
                  }
                }}
                defaultValue={isSelected}
              />
              {(isSelected && FormConfiguration) && <FormConfiguration editingValue={editingValue} setEditing={setEditing} saveEdit={saveEdit}/>}
              </>
            }
          )}
          </>
  
}