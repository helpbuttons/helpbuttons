//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

//imported internal classes, variables, files or functions
import { GlobalState, store } from 'pages';
import { SignupUser } from 'state/Users';

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
import { useStore } from 'store/Store';
import FieldText from 'elements/Fields/FieldText';
import { Network } from 'shared/entities/network.entity';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { useMetadataTitle } from 'state/Metadata';

export default function Signup() {
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

  const onSubmit = (data) => {
    
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
            acceptPrivacyPolicy: data.acceptPrivacyPolicy
          },
          onSuccess,
          onError,
        ),
      );
    
  };

  const onSuccess = (userData) => {
    store.emit(new SetMainPopup(MainPopupPage.HIDE))
  };

  const onError = (error) => {
    setValidationErrors(error?.validationErrors, setError);
    console.log(error);
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
                isSubmitting={isSubmitting}
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