// create admin!
// username
// email
// password

import Popup from 'components/popup/Popup';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import FieldPassword from 'elements/Fields/FieldPassword';
import FieldText from 'elements/Fields/FieldText';
import Form from 'elements/Form';
import router from 'next/router';
import { GlobalState, store } from 'pages';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { HttpStatus } from 'services/HttpService/http-status.enum';
import { IConfig } from 'services/Setup/config.type';
import { CreateAdmin, GetConfig } from 'state/Setup';
import { useRef } from 'store/Store';
import { SetupSteps } from '../../../shared/setupSteps';

export default CreateAdminForm;

function CreateAdminForm() {
  const errorMessageConfigJson = `Configuration config.json not found, please run the <a href='/Setup/SysadminConfig'>setup again</a>, or reload the server.`
  const warningMessageMigrations = `Please run migrations, before continuing <u><pre>$ docker-compose exec api yarn migration:run</pre></u>
  Please click here to <a href='/Setup/CreateAdminForm'>reload</a>`;
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    register,
    setError,
  } = useForm({
    defaultValues: {
      username: 'admin',
      password: 'qwerty1234',
      password_confirm: 'qwerty1234',
      email: 'admin@admin.com',
    },
  });

  const config: IConfig = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  const onSubmit = (data) => {
    if (data.password != data.password_confirm) {
      const passwordsWontMatch = {
        type: 'custom',
        message: "passwords won't match",
      };
      setError('password', passwordsWontMatch);
      setError('password_confirm', passwordsWontMatch);
      return;
    }
    store.emit(
      new CreateAdmin(
        {
          username: data.username,
          email: data.email,
          password: data.password,
        },
        () => {
          router.push({
            pathname: SetupSteps.FIRST_OPEN,
          });
        },
        (err) => {
          if (err?.statusCode === HttpStatus.CONFLICT) {
            alertService.warn(
              `You already created an admin account, do you want to <a href="/Login">login</a>? Or you want to <a href="${SetupSteps.FIRST_OPEN}">configure your instance</a>?`,
            );
          }
          console.log(JSON.stringify(err));
        },
      ),
    );
  };

  return (
    <>
      <Popup title="Create Admin User">
        <Form classNameExtra="createAdmin">
          <div className="login__form">
            <div className="form__inputs-wrapper">
              <FieldText
                name="username"
                label="Name"
                classNameInput="squared"
                validationError={errors.username}
                {...register('username', { required: true })}
              ></FieldText>
              <FieldText
                name="email"
                label="Email address"
                classNameInput="squared"
                validationError={errors.email}
                {...register('email', { required: true })}
              ></FieldText>
              <FieldPassword
                name="password"
                label="Password"
                classNameInput="squared"
                validationError={errors.password}
                {...register('password', {
                  required: true,
                  minLength: 8,
                })}
              ></FieldPassword>
              <FieldPassword
                name="password_confirm"
                label="Confirm password"
                classNameInput="squared"
                validationError={errors.password}
                {...register('password_confirm', {
                  required: true,
                  minLength: 8,
                })}
              ></FieldPassword>
            </div>
          </div>
          <div className="form__btn-wrapper">
            <Btn
              btnType={BtnType.splitIcon}
              caption="NEXT"
              contentAlignment={ContentAlignment.center}
              isSubmitting={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              disabled={config?.databaseNumberMigrations < 1}
            />
          </div>
        </Form>
      </Popup>
    </>
  );
}
