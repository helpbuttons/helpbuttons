//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

//imported internal classes, variables, files or functions
import { store } from 'pages';
import { Login } from 'state/Profile';
import { NavigateTo } from 'state/Routes';
import Form from 'elements/Form';
import FieldText from 'elements/Fields/FieldText';
import FieldPassword from 'elements/Fields/FieldPassword';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { Link } from 'elements/Link';
import { useRouter } from 'next/router';
import t from 'i18n';
import { alertService } from 'services/Alert';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [errorMsg, setErrorMsg] = useState(undefined);
  const router = useRouter();

  const onSubmit = (data) => {
    store.emit(
      new Login(data.email.toLowerCase(), data.password, onSuccess, onError),
    );
  };

  const onSuccess = (userData) => {
    alertService.success(t('user.loginSucess'))
    store.emit(new SetMainPopup(MainPopupPage.HIDE))
  };

  const onError = (err) => {
    if (err === 'login-incorrect') {
      setErrorMsg('User or password not found');
    }
  };
  const params: URLSearchParams = new URLSearchParams(router.query);

  return (
    <Form onSubmit={handleSubmit(onSubmit)} classNameExtra="login">
      <div className="login__form">
        <div className="form__inputs-wrapper">
          <FieldText
            name="email"
            label={t('user.email')}
            classNameInput="squared"
            placeholder={t('user.emailPlaceHolder')}
            validationError={errors.email}
            {...register('email', { required: true })}
          ></FieldText>
          <FieldPassword
            name="password"
            label={t('user.password')}
            classNameInput="squared"
            placeholder={t('user.passwordPlaceHolder')}
            validationError={errors.password}
            {...register('password', { required: true })}
          ></FieldPassword>
        </div>
        {errorMsg && (
          <div className="form__input-subtitle--error">
            {errorMsg}
          </div>
        )}
        <div className="form__btn-wrapper">
          <Btn
            submit={true}
            btnType={BtnType.submit}
            caption={t('user.loginButton')}
            contentAlignment={ContentAlignment.center}
            isSubmitting={isSubmitting}
          />
          <div className="popup__link">
            <div
              onClick={() => store.emit(new SetMainPopup(MainPopupPage.REQUEST_LINK))}
              className={`nav-bottom__link`}
            >
              {t('user.loginClick')}
            </div>
          </div>
          <div className="popup__link">
            <div onClick={() => store.emit(new SetMainPopup(MainPopupPage.SIGNUP))} className={`nav-bottom__link`}>
              {t('user.noAccount')}
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
