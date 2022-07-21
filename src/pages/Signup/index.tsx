//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageWrapper, { ImageType } from 'elements/ImageWrapper'

//imported internal classes, variables, files or functions
import { store } from 'pages/index';
import { SignupEvent } from 'pages/Signup/data';

//imported react components
import Alert from 'components/overlay/Alert';
import { Link } from 'elements/Link';
import Popup from 'components/popup/Popup';
import Btn, {ContentAlignment, BtnType, IconType} from 'elements/Btn'
import FieldText from 'elements/Fields/FieldText';
import FieldPassword from 'elements/Fields/FieldPassword';
import Form from 'elements/Form';
import PopupOptions from 'components/popup/PopupOptions'
import PopupImg from 'components/popup/PopupImg';
import PopupSection from 'components/popup/PopupSection';
import { NavigateTo } from 'pages/Common/data';
import { alertService } from 'services/Alert';

export default function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = (data) => {
    store.emit(new SignupEvent(data.email, data.password, onSuccess, onError));
  };

  const onSuccess = () => {
    // TODO: show message saying to check the email
    alertService.info("You've signed up sucessfuly!"); // this won't show up
    store.emit(new NavigateTo("/")); 
  }

  const onError = (err) => {
    // TODO: terminar esto
    alertService.error(err);
    console.error(err);
  }

  return (
      <Popup title="Signup" linkFwd="/HomeInfo">
          <Form onSubmit={handleSubmit(onSubmit)} classNameExtra="login">
              <div className="login__form">
                  <div className="form__inputs-wrapper">
                      <FieldText 
                        name="email" 
                        label="Email" 
                        classNameInput="squared"
                        placeholder="email@email.em"
                        validationError={ errors.email }
                        {...register("email", { required: true })}
                      ></FieldText>
                      <FieldPassword 
                        name="password" 
                        label="Password" 
                        classNameInput="squared"
                        placeholder="Type your password"
                        validationError={ errors.password }
                        {...register("password", { required: true, minLength: 8 })}
                      ></FieldPassword>
                  </div>
                  <div className="form__btn-wrapper">
                      <Btn btnType={BtnType.splitIcon} caption="REGISTER" contentAlignment={ContentAlignment.center} isSubmitting={isSubmitting}/>
                      <div className="popup__link">
                          <Link href="/Login">I have an account</Link>
                      </div>
                  </div>
              </div>
          </Form>
      </Popup>
  );
}
