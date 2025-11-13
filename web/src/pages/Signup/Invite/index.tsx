//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GlobalState, store, useGlobalStore } from 'state';
import Form from 'elements/Form';
import NewUserFields from 'components/user/NewUserFields';
import { useForm } from 'react-hook-form';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import t from 'i18n';
import {  LoginQR, SignupQR } from 'state/Profile';
import { alertService } from 'services/Alert';
import { getLocale } from 'shared/sys.helper';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import dconsole from 'shared/debugger';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import HomeInfo from 'pages/HomeInfo';

export default function Invite( {metadata})
{
  useEffect(() => {
    store.emit(new SetMainPopup(MainPopupPage.INVITE))
  }, [])
  
  return <HomeInfo metadata={metadata}/>
}

export function InviteForm() {
  const router = useRouter();
  const code = router.query.code as string;
  const invitationCode = useGlobalStore((state: GlobalState) => state.homeInfo.invitationCode);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      qrCode: '',
      locale: 'en',
      tags: [],
      acceptPrivacyPolicy: 'no'
    },
  });

  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loginCode = code ? code : invitationCode
    if(loginCode)
    {
      const onLoggingInSuccess = () => {
        store.emit(new SetMainPopup(MainPopupPage.HIDE))
        router.push(`/HomeInfo`)
      }
      // store.emit(new Login(code, code, onLoggingInSuccess, () => {}))
      store.emit(new LoginQR(loginCode, null, onLoggingInSuccess, (err) => { 
        if(err == 'login-incorrect')
        {
          setLoading(false)
          dconsole.log('tryin to login, failed, its ok, qr code is not registered yet')
        }else{
          dconsole.error(err)
        }
      }))
    }
  }, [code])
  
  const onSubmit = (data) => {
      store.emit(
        new SignupQR(
          {
            name: data.name,
            username: data.username,
            qrCode:  code ? code : invitationCode,
            locale: getLocale(),
            acceptPrivacyPolicy: data.acceptPrivacyPolicy
          },
          () => {
            // router.push(`/HomeInfo`)
            store.emit(new SetMainPopup(MainPopupPage.HIDE))
          },
          () => {
            alertService.error('Error, invitation code not valid')
          },
        ),
      );
  };
  
  
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)} classNameExtra="login">
        <div className="login__form">
          {t('user.explainGuestDetails')}          
          <div className="form__inputs-wrapper">
            <NewUserFields
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              short={true}
            />
          </div>
          <div className="form__btn-wrapper">
            <div className="from__btn-register">
              <Btn
                submit={true}
                btnType={BtnType.submit}
                caption={t('user.register')}
                contentAlignment={ContentAlignment.center}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </Form>
    </>
    
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('seo.invite'), ctx);
};