//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

//imported internal classes, variables, files or functions
import { store } from 'pages';
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
      locale: 'en'
    },
  });
  const router = useRouter();
  const { pathname, asPath, query } = router

  const locale = watch('locale')
  useEffect(() => {
    if(locale != getLocale())
    {
      alertService.info(`Click <a href="/${locale}/Signup">here</a> to change language`)
   }
  }, [locale, pathname])
  const onSubmit = (data) => {
    
    if (passwordsMatch(data, setError)) {
      store.emit(
        new SignupUser(
          {
            username: data.username,
            email: data.email,
            password: data.password,
            name: '',
            avatar: data.avatar,
            locale: getLocale(),
          },
          onSuccess,
          onError,
        ),
      );
    }
  };

  const onSuccess = () => {
    const returnUrl: string = router.query.returnUrl
      ? router.query.returnUrl.toString()
      : '/ProfileEdit';
    store.emit(new NavigateTo(returnUrl));
  };

  const onError = (error) => {
    setValidationErrors(error?.validationErrors, setError);
    console.log(error);
    alertService.error(error.caption);
  };
  
  const params: URLSearchParams = new URLSearchParams(router.query);

  return (
    <Popup title="Signup" linkFwd="/HomeInfo">
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
            <Btn
              submit={true}
              btnType={BtnType.splitIcon}
              caption={t('user.register')}
              contentAlignment={ContentAlignment.center}
              isSubmitting={isSubmitting}
            />
            <div className="popup__link">
              <Link href={`/Login?${params.toString()}`}>
                {t('user.loginLink')}
              </Link>
            </div>
          </div>
        </div>
      </Form>
    </Popup>
  );
}
