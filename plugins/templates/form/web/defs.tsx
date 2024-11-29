// import { AddField } from 'components/button/ButtonType/CustomFields/AddCustomFields';

export class FormTemplate {
  //  public static getConfigurationAddField(){
  // const name = 'form';
  // const icon = `<IoBarChart/>`;
  // const explain = 'This field will create a form for the users';
  // const text = 'Form';
  // console.log('going')
  // return 'lala'
  // return {name, icon, explain, text}
  // return <AddField template={template} customFields={customFields} setCustomFields={(value) => setCustomFields(value)} />
  // }
}

export const TemplateFormDefinitions = () => {
  const name = 'form';
  const icon = `<IoBarChart/>`;
  const explain = 'This field will create a form for the users';
  const text = 'Form';
  // console.log('going')
  // return 'lala'
  return { name, icon, explain, text }
}