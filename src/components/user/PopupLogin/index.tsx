//Form component with the main fields for signup in the platform
//imported from libraries
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Image from 'next/image'

//imported react components
import Alert from 'components/overlay/Alert';
import Popup from 'components/popup/Popup';
import { Link } from 'elements/Link';

//imported internal classes, variables, files or functions
import { store } from 'pages/index';
import { alertService } from 'services/Alert';
import { LoginEvent } from 'pages/Login/data';



export default function PopupLogin() {

  // form validation rules
  const validationSchema = Yup.object().shape({
      email: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required')
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(user) {

    console.log('login');

    store.emit(new LoginEvent(user.email, user.password));

  }

  return (

          <Popup title="Login">

              <div className="popup__img">
                <Image layout='fill' objectFit="contain" src="https://dummyimage.com/550x200/#ccc/fff" alt="Register_img" className="" />
              </div>

              <form className="popup__section" onSubmit={handleSubmit(onSubmit)}>

                  <div className="form__field">
                      <label>Email / Username</label>
                      <input name="email" type="text" {...register('email')} className={`form__input ${errors.username ? '' : ''}`} />
                      <div className="invalid-feedback">{errors.username?.message}</div>
                  </div>
                  <div className="form__field">
                      <label>Password</label>
                      <input name="password" type="password" {...register('password')} className={`form__input ${errors.password ? '' : ''}`} />
                      <div className="invalid-feedback">{errors.password?.message}</div>
                  </div>
                  <button disabled={formState.isSubmitting} className="btn-with-icon">
                    {formState.isSubmitting && <span className=""></span>}
                    <div className="btn-filter__icon">
                    </div>
                    <div className="btn-with-icon__text">
                      ENTER
                    </div>
                  </button>

              </form>

              <div className="popup__options-v">

                <Link href="/Signup" className="popup__options-btn">I don&apos;t have an account</Link>

              </div>

          </Popup>

  );

}
