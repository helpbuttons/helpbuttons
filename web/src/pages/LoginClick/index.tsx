import Popup from 'components/popup/Popup';
import Form from 'elements/Form';
import t from 'i18n';
import React, { useState } from 'react';
import { Link } from 'elements/Link';
import FieldText from 'elements/Fields/FieldText';
import { useForm } from 'react-hook-form';
import router from 'next/router';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import { store } from 'pages';
import { RequestNewLoginToken } from 'state/Users';
import { alertService } from 'services/Alert';

export default function LoginClick() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [errorMsg, setErrorMsg] = useState(undefined);

  const onSubmit = (data) => {
    console.log(data);
    store.emit(
      new RequestNewLoginToken(
        data.email,
        () => {
          alertService.success(t('user.newLoginTokenSent'));
        },
        () => {
          alertService.error(t('user.errorRequestNewLoginToken'));
        },
      ),
    );
  };
  //   RequestNewLoginToken
  const params: URLSearchParams = new URLSearchParams(router.query);

  return (
    <>
      <Popup title="LoginClick" linkFwd="/HomeInfo">
        <Form
          onSubmit={handleSubmit(onSubmit)}
          classNameExtra="login"
        >
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
                caption={t('user.sendLoginToken')}
                contentAlignment={ContentAlignment.center}
                isSubmitting={isSubmitting}
              />
              <div className="popup__link">
                <Link href={`/Login?${params.toString()}`}>
                  {t('user.loginWEmail')}
                </Link>
              </div>
              <div className="popup__link">
                <Link href={`/Signup?${params.toString()}`}>
                  {t('user.noAccount')}
                </Link>
              </div>
            </div>
          </div>
        </Form>
      </Popup>
    </>
  );
}
