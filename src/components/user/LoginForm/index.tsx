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
import { Link } from 'elements/Link';



export default function LoginForm() {
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
            <Form onSubmit={handleSubmit} classNameExtra="login">
              <div className="login__form">
                <div className="form__inputs-wrapper">
                  <FieldText 
                    handleChange={setValue} 
                    name="email" 
                    label="Email" 
                    validationError={validationErrors.email}
                    classNameInput="squared"
                    placeholder="email@email.em"
                  ></FieldText>
                  <FieldPassword 
                    handleChange={setValue} 
                    name="password" 
                    label="Password" 
                    validationError={validationErrors.password}
                    classNameInput="squared"
                    placeholder="Type your password"
                  ></FieldPassword>
                </div>
                <div className="form__btn-wrapper">
                  <Btn 
                    btnType={BtnType.splitIcon} 
                    caption="ENTER" 
                    contentAlignment={ContentAlignment.center} 
                    isSubmitting={isSubmitting}
                  />
                  <div className="popup__link">
                    <Link href="/Signup">I don&apos;t have an account</Link>
                  </div>
                </div>
              </div>
            </Form>

  );

}
