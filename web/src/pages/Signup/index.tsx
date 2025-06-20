//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

//imported internal classes, variables, files or functions
import { GlobalState, store } from 'state';
import { SignupUser } from 'state/Profile';

//imported react components
import { Link } from 'elements/Link';
import Popup from 'components/popup/Popup';
import Btn, {
  ContentAlignment,
  BtnType,
  IconType,
} from 'elements/Btn';
import Form from 'elements/Form';
import { NavigateTo } from 'state/Routes';
import { useRouter } from 'next/router';
import NewUserFields, {
  passwordsMatch,
} from 'components/user/NewUserFields';
import { alertService } from 'services/Alert';
import t from 'i18n';
import { setValidationErrors } from 'state/helper';
import { getLocale } from 'shared/sys.helper';
import { useStore } from 'state';
import FieldText from 'elements/Fields/FieldText';
import { Network } from 'shared/entities/network.entity';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { useMetadataTitle } from 'state/Metadata';
import dconsole from 'shared/debugger';
import HomeInfo from 'pages/HomeInfo';
import { cookiesAreAccepted } from 'components/home/CookiesBanner';

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
          },
          onSuccess,
          onError,
        ),
      );
    
  };

  const onSuccess = (userData) => {
    setIsSubmitting(false)
    const cookiesAccepted = cookiesAreAccepted()
    if(!cookiesAccepted){
      return false;
    }
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
          </div>
        </div>
      </Form>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('user.register'), ctx)
};