//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

//imported internal classes, variables, files or functions
import { GlobalState, store, useGlobalStore, useStore } from 'state';
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
import { CookiesState, MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { handleAcceptCookies } from 'components/home/CookiesBanner';
import { Network } from 'shared/entities/network.entity';

export function LoginEmailForm() {
  const { register, handleSubmit, onSubmit, errors, errorMsg, isSubmitting, selectedNetwork } = useLoginForm()

  return (
    <Form onSubmit={handleSubmit(onSubmit)} classNameExtra="login__form">
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
          onForgotPass={() => store.emit(new SetMainPopup(MainPopupPage.REQUEST_LINK))}
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

      <Btn
        submit={true}
        disabled={isSubmitting}
        btnType={BtnType.submit}
        caption={t('user.loginButton')}
        contentAlignment={ContentAlignment.center}
        isSubmitting={isSubmitting}
      />
      <div className="form__btn-wrapper">

        <div className="popup__link" onClick={() => store.emit(new SetMainPopup(MainPopupPage.SIGNUP))} >
          {t('user.noAccount')}
        </div>


        {selectedNetwork?.allowGuestCreation &&
          <div className="popup__link" onClick={() => store.emit(new SetMainPopup(MainPopupPage.SIGNUP_AS_GUEST))}>

            {t('user.signupAsGuest')}
          </div>
        }
      </div>
    </Form>
  );
}

export function LoginQrForm() {

  const { register, handleSubmit, onSubmit, errors, errorMsg, isSubmitting, selectedNetwork } = useLoginForm()
  return (
    <Form onSubmit={handleSubmit(onSubmit)} classNameExtra="login__form">
      <div className="form__inputs-wrapper">
        <>
          <FieldText
            name="code"
            label={t('user.guestCode')}
            classNameInput="squared"
            placeholder={t('user.guestCodePlaceHolder')}
            validationError={errors.email}
            {...register('guestCode', { required: true })}
          ></FieldText>
          <FieldText
            name="name"
            label={t('user.name')}
            classNameInput="squared"
            placeholder={t('user.namePlaceHolder')}
            validationError={errors.email}
            {...register('name', { required: true })}
          ></FieldText>
        </>
      </div>
      {errorMsg && (
        <div className="form__input-subtitle--error">
          {errorMsg}
        </div>
      )}

      <Btn
        submit={true}
        disabled={isSubmitting}
        btnType={BtnType.submit}
        caption={t('user.loginButton')}
        contentAlignment={ContentAlignment.center}
        isSubmitting={isSubmitting}
      />
      <div className="form__btn-wrapper">
        {selectedNetwork?.allowGuestCreation &&
          <div className="popup__link" onClick={() => store.emit(new SetMainPopup(MainPopupPage.SIGNUP_AS_GUEST))}>

            {t('user.askForNewCode')}
          </div>
        }
      </div>
    </Form>
  );
}

export default function LoginForm({
}) {
  return <LoginEmailForm />
}


const useLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [errorMsg, setErrorMsg] = useState(undefined);
  const router = useRouter();

  const onSubmit = (data) => {
    handleAcceptCookies()
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
      setErrorMsg(t('user.loginNotFound'));
    }
  };
  const params: URLSearchParams = new URLSearchParams(router.query);

  const selectedNetwork: Network = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );

  return { register, handleSubmit, onSubmit, errors, errorMsg, isSubmitting, selectedNetwork };
}