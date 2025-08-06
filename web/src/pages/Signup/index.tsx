//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

//imported internal classes, variables, files or functions
import { GlobalState, store } from 'state';
import { RequestGuestInvite, SignupUser } from 'state/Profile';

//imported react components
import QRCode from 'qrcode';
import Btn, {
  ContentAlignment,
  BtnType,
} from 'elements/Btn';
import Form from 'elements/Form';
import { useRouter } from 'next/router';
import NewUserFields from 'components/user/NewUserFields';
import { alertService } from 'services/Alert';
import t from 'i18n';
import { setValidationErrors } from 'state/helper';
import { getLocale, getShareLink } from 'shared/sys.helper';
import { useStore } from 'state';
import { Network } from 'shared/entities/network.entity';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import { MainPopupPage, SetInvitationPopup, SetMainPopup } from 'state/HomeInfo';
import { useMetadataTitle } from 'state/Metadata';
import dconsole from 'shared/debugger';
import HomeInfo from 'pages/HomeInfo';
import { getInvitationLink } from 'pages/Profile/Invites';

export default function Signup( {metadata})
{
  useEffect(() => {
    store.emit(new SetMainPopup(MainPopupPage.SIGNUP))
  }, [])
  
  return <HomeInfo metadata={metadata}/>
}
export function SignupForm() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      password_confirm: '',
      email: '',
      locale: 'en',
      inviteCode: '',
      tags: [],
      acceptPrivacyPolicy: 'no'
    },
  });
  const router = useRouter();

  const selectedNetwork: Network = useStore(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  useMetadataTitle(t('menu.register'))

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit = (data) => {
    setIsSubmitting(true)
    // if (passwordsMatch(data, setError)) {
      store.emit(
        new SignupUser(
          {
            name: data.name,
            username: data.username,
            email: data.email.toLowerCase(),
            password: data.password,
            avatar: null,
            locale: getLocale(),
            inviteCode: data.inviteCode,
            acceptPrivacyPolicy: data.acceptPrivacyPolicy,
            qrcode: null
          },
          onSuccess,
          onError,
        ),
      );
    
  };

  const onSuccess = (userData) => {
    setIsSubmitting(false)
    store.emit(new SetMainPopup(MainPopupPage.HIDE))
    alertService.success(t('user.signupSuccess', [selectedNetwork.name]))
  };

  const onError = (error) => {
    setIsSubmitting(false)
    setValidationErrors(error?.validationErrors, setError);
    dconsole.error(error);
    alertService.error(error.caption);
  };

  const inviteCode = watch('inviteCode')

  const params: URLSearchParams = new URLSearchParams(router.query);
  useEffect(() => {
    if(router?.query)
    {
      setValue('inviteCode', params.get('inviteCode'))
    }
  }, [router])

  if(selectedNetwork?.inviteOnly && !inviteCode) {
    return (<>{t('invite.inviteOnlyNetwork')}</>
    )
  }
  return (
      <Form onSubmit={handleSubmit(onSubmit)} classNameExtra="login">
        <div className="login__form">
          <div className="form__inputs-wrapper">
            <NewUserFields
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          </div>
          <div className="form__btn-wrapper">
            <div className="from__btn-register">
              <Btn
                submit={true}
                btnType={BtnType.submit}
                caption={t('user.register')}
                contentAlignment={ContentAlignment.center}
                disabled={isSubmitting}
              />
            </div>
            <div className="popup__link">
              <div onClick={() => store.emit(new SetMainPopup(MainPopupPage.LOGIN))} className={`nav-bottom__link`}>
                {t('user.loginLink')}
              </div>
            </div>
            {selectedNetwork?.allowGuestCreation && 
              <div className="popup__link">
                <div onClick={() => store.emit(new SetMainPopup(MainPopupPage.SIGNUP_AS_GUEST))} className={`nav-bottom__link`}>
                  {t('user.signupAsGuest')}
                </div>
              </div>
            }
          </div>
        </div>
      </Form>
  );
}




enum steps {
  REQUEST_CODE,
  SUCCESS
}
export function SignupAsGuestForm() {
  const [code, setCode] = useState(null)
  const [qrCodeData, setQrCodeData] = useState(null);
  const [invitationLink, setInvitationLink] = useState(null);
  const [step, setStep] = useState<steps>(steps.REQUEST_CODE)

  const {
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setStep(steps.SUCCESS)
  };

  const requestNewGuestCode = () => {
    store.emit(new RequestGuestInvite((code) => {
      setCode(code)
      const link = getInvitationLink(code);
      setInvitationLink(getShareLink(link))
      QRCode.toDataURL(getShareLink(link), function (err, dataUrl) {
        setQrCodeData(() => dataUrl);
      });
      setStep(steps.SUCCESS)
    }))
  }
  return <>
    <Form onSubmit={handleSubmit(onSubmit)} classNameExtra="login">
      <div className="login__form">
        <div className="form__inputs-wrapper">
          {step == steps.REQUEST_CODE &&
            <>
              <div>{t('user.explainPublishAsGuest')}</div>
              <Btn
                submit={false}
                btnType={BtnType.submit}
                caption={t('user.generateCode')}
                contentAlignment={ContentAlignment.center}
                onClick={() => requestNewGuestCode()}
              />
            </>
          }
          {step == steps.SUCCESS &&
            <>
              <div>{t('user.explainUseGuestCode')}</div>
              {qrCodeData && <><img src={qrCodeData} />{invitationLink}</>}
              <Btn
                submit={false}
                btnType={BtnType.submit}
                caption={t('user.signupGuestDetails')}
                contentAlignment={ContentAlignment.center}
                onClick={() => {
                  store.emit(new SetInvitationPopup(code))
                }}
              />
            </>
          }


        </div>
        <div className="form__btn-wrapper">
          {(step == steps.REQUEST_CODE) &&
            <>
              <div className="popup__link">
                <div onClick={() => store.emit(new SetMainPopup(MainPopupPage.LOGIN))} className={`nav-bottom__link`}>
                  {t('user.loginLink')}
                </div>
              </div>
              <div className="popup__link">
                <div onClick={() => store.emit(new SetMainPopup(MainPopupPage.SIGNUP))} className={`nav-bottom__link`}>
                  {t('user.noAccount')}
                </div>
              </div>
            </>}
        </div></div>
    </Form>
  </>
}


export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('user.register'), ctx)
};