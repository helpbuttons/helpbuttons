import Popup from 'components/popup/Popup';
import NewUserFields, {
  passwordsMatch,
} from 'components/user/NewUserFields';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';
import Form from 'elements/Form';
import router from 'next/router';
import { GlobalState, store } from 'pages';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { SetupDtoOut } from 'services/Setup/config.type';
import { HttpStatus } from 'shared/types/http-status.enum';
import { CreateAdmin, GetConfig } from 'state/Setup';
import { useRef } from 'store/Store';
import { SetupSteps } from '../../../shared/setupSteps';
import t from 'i18n';
import { useEffect, useState } from 'react';

export default CreateAdminForm;

function CreateAdminForm() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    register,
    setError,
    control,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      password_confirm: '',
      email: '',
      name: '',
      locale: 'en',
    },
  });

  const config: SetupDtoOut = useRef(
    store,
    (state: GlobalState) => state.config,
  );

  const getConfig = () => {
    store.emit(
      new GetConfig(
        (configuration) => {
          console.log('config got!')
        },
        (error) => {
          
          if(error == 'not-found')
          {
            router.push(SetupSteps.SYSADMIN_CONFIG);
            return;
          }

          console.log(error)
          return;
        },
      ),
    );
  }

  const [disableSave, setDisableSave] = useState(true);

  useEffect(() => {
    if(config && config.databaseNumberMigrations > 0)
    {
      setDisableSave(false)
    }
    if (config && config.userCount > 0)
    {
      alertService.error('Admin already created')
      setDisableSave(true)
    }
    if (config && config.databaseNumberMigrations < 1)
    {
      alertService.warn(
        `Please need to run migrations on the database.`
      );
    }
    
  }, [config])

  const onSubmit = (data) => {
    if (passwordsMatch(data, setError)) {
      store.emit(
        new CreateAdmin(
          {
            username: data.username,
            email: data.email,
            password: data.password,
            name: '',
            avatar: data.avatar,
            locale: data.locale
          },
          () => {
            router.push({
              pathname: SetupSteps.FIRST_OPEN,
            });
          },
          (err) => {
            if (err?.statusCode === HttpStatus.CONFLICT) {
              alertService.warn(
                `You already created an admin account, do you want to <a href="/Login">login</a>? Or you want to <a href="${SetupSteps.FIRST_OPEN}">configure your network</a>?`,
              );
            }
            console.log(JSON.stringify(err));
          },
        ),
      );
    }
  };

  return (
    <>
      <Popup
        title={t('setup.createAdminTitle')}
        linkFwd="/Setup/NetworkCreation"
      >
        <Form
          onSubmit={handleSubmit(onSubmit)}
          classNameExtra="create-admin"
        >
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
          </div>
          <div className="form__btn-wrapper">
            <Btn
              submit={true}
              btnType={BtnType.submit}
              caption={t('common.next')}
              contentAlignment={ContentAlignment.center}
              isSubmitting={isSubmitting}
              disabled={disableSave}
            />
            {disableSave && 
              <Btn
                btnType={BtnType.splitIcon}
                caption={t('common.reloadConfig')}
                contentAlignment={ContentAlignment.center}
                onClick={() => getConfig()}
              />
            }
          </div>
        </Form>
      </Popup>
    </>
  );
}
