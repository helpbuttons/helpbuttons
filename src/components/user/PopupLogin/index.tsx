//Form component with the main fields for signup in the platform
//imported from libraries
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { catchError } from 'rxjs/operators';
import { useEffect } from 'react';

//imported internal classes, variables, files or functions
import { store } from 'pages/index';
import { userService } from 'services/Users';
import { alertService } from 'services/Alert';
import { SignupEvent } from 'pages/Signup/data';

//imported react components
import Alert from 'components/overlay/Alert';
import Popup from 'components/popup/Popup';
import { Link } from 'elements/Link';


export default function PopupLogin() {

  const router = useRouter();

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

    store.emit(new LoginEvent(user.email, user.password));

  }

  return (
      <>
          <Popup>

              <form className="popup__section" onSubmit={handleSubmit(onSubmit)}>
              
                  <div className="form__field">
                      <label>Username</label>
                      <input name="username" type="text" {...register('username')} className={`form__input ${errors.username ? '' : ''}`} />
                      <div className="invalid-feedback">{errors.username?.message}</div>
                  </div>
                  <div className="form__field">
                      <label>Password</label>
                      <input name="password" type="password" {...register('password')} className={`form__input ${errors.password ? '' : ''}`} />
                      <div className="invalid-feedback">{errors.password?.message}</div>
                  </div>
                  <button disabled={formState.isSubmitting} className="btn-with-icon button-with-icon--offer">
                    {formState.isSubmitting && <span className=""></span>}
                    <div className="btn-filter__icon">
                    </div>
                    <div className="btn-with-icon__text">
                      ENTRAR
                    </div>
                  </button>

              </form>

              <div className="popup__options-v">

                <Link href="/Signup" className="popup__options-btn">Register</Link>

              </div>

          </Popup>
      </>
  );

}
