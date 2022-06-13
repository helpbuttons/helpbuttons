//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

//imported internal classes, variables, files or functions
import { store } from 'pages/index';
import { LoginFormEvent } from './data';
import Form from 'elements/Form';
import FieldText from 'elements/Fields/FieldText';
import FieldPassword from 'elements/Fields/FieldPassword';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';



export default function LoginForm({children}) {
  const fields = {
    email: "",
    password: "",
  };
  const [values, setValues] = useState(fields);
  const [validationErrors, setValidationErrors] = useState(fields);

  const {formState: { isSubmitting }} = useForm()

  const setValue = (name, value) => {
    setValues({ ...values, [name]: value });
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    store.emit(new LoginFormEvent(values.email, values.password, setValidationErrors));
  };

  return (
            <Form onSubmit={handleSubmit}>
                <FieldText handleChange={setValue} name="email" label="Email" validationError={validationErrors.email}></FieldText>
                <FieldPassword handleChange={setValue} name="password" label="Password" validationError={validationErrors.password}></FieldPassword>
                
                <Btn btnType={BtnType.splitIcon} caption="ENTER" contentAlignment={ContentAlignment.center} isSubmitting={isSubmitting}/>

            </Form>

  );

}
