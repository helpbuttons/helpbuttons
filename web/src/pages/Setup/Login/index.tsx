import Popup from "components/popup/Popup";
import Btn, { BtnType, ContentAlignment } from "elements/Btn";
import FieldPassword from "elements/Fields/FieldPassword";
import FieldText from "elements/Fields/FieldText";
import Form from "elements/Form";
import t from "i18n";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { alertService } from "services/Alert";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";
import { SetupSteps } from "shared/setupSteps";
import { store } from "state";
import { Login as LoginRequest } from 'state/Profile';

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm();
    useEffect(() => {
        localStorageService.save(LocalStorageVars.COOKIES_ACCEPTANCE, true);
    }, [])
    const [errorMsg, setErrorMsg] = useState(undefined);

    const router = useRouter()

    const onSubmit = (data) => {
        store.emit(new LoginRequest(data.email.toLowerCase(), data.password, onSuccess, onError));
    };

    const onSuccess = (userData) => {
        alertService.success(t('user.loginSucess'))
        router.push(SetupSteps.FIRST_OPEN)
    };

    const onError = (err) => {
        if (err === 'login-incorrect') {
            setErrorMsg('User or password not found');
        }
    };

    return <Popup>
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
                </div>
            </div>
        </Form>
    </Popup>
}
