//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GlobalState, store } from 'state';
import Form from 'elements/Form';
import NewUserFields from 'components/user/NewUserFields';
import { useForm } from 'react-hook-form';
import { useStore } from 'state';
import { Network } from 'shared/entities/network.entity';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import t from 'i18n';
import Popup from 'components/popup/Popup';
import { Login, LoginQR, SignupQR } from 'state/Profile';
import { alertService } from 'services/Alert';
import { getLocale } from 'shared/sys.helper';
import { LoadabledComponent } from 'components/loading';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import dconsole from 'shared/debugger';

export default function Invite() {
  const router = useRouter();
  const [code, setCode] = useState(null)
  
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
  const selectedNetwork: Network = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  
  useEffect(() => {
    if(!router.isReady){
      return;
    }
    const code = router.query.code as string;
    setCode(() => code)
  }, [router.isReady])
  
  useEffect(() => {
    if(code)
    {
      const onLoggingInSuccess = () => {
        router.push(`/HomeInfo`)
      }
      // store.emit(new Login(code, code, onLoggingInSuccess, () => {}))
      store.emit(new LoginQR(code, null, onLoggingInSuccess, (err) => { 
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
            qrCode:  code,
            locale: getLocale(),
            acceptPrivacyPolicy: data.acceptPrivacyPolicy
          },
          () => {
            router.push(`/HomeInfo`)
          },
          () => {
            alertService.error('Error, invitation code not valid')
          },
        ),
      );
  };
  
  
  return (
    <>
      <Popup>
        <LoadabledComponent loading={loading}>
      <Form onSubmit={handleSubmit(onSubmit)} classNameExtra="login">
        <div className="login__form">
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
      </LoadabledComponent>
      </Popup>
    </>
    
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('seo.invite'), ctx);
};