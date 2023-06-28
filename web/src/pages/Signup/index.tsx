//Form component with the main fields for signup in the platform
//imported from libraries
import React, { useState } from 'react';
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
    },
  });
  const [errorMsg, setErrorMsg] = useState(undefined);

  const router = useRouter();

  const onSubmit = (data) => {
    if (passwordsMatch(data, setError)) {
      // store.emit(new SignupUser(data.email, data.password, data.name, onSuccess, onError));
      store.emit(
        new SignupUser(
          {
            username: data.username,
            email: data.email,
            password: data.password,
            name: '',
            avatar: data.avatar,
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
      : '/';

    store.emit(new NavigateTo(returnUrl));
  };
  
  const onError = (errorMessage) => alertService.error(errorMessage.caption)

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
          {errorMsg && (
            <div className="form__input-subtitle--error">
              {errorMsg}
            </div>
          )}
          <div className="form__btn-wrapper">
            <Btn
              submit={true}
              btnType={BtnType.splitIcon}
              caption="REGISTER"
              contentAlignment={ContentAlignment.center}
              isSubmitting={isSubmitting}
            />
            <div className="popup__link">
              <Link href={`/Login?${params.toString()}`}>
                I have an account
              </Link>
            </div>
          </div>
        </div>
      </Form>
    </Popup>
  );
}
