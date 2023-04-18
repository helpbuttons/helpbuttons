// IF sql and email are not set... show form!
//Form component with the main fields for signup in the platform
//imported from libraries
//imported react components
import Popup from 'components/popup/Popup';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';

//imported internal classes, variables, files or functions
import FieldText from 'elements/Fields/FieldText';
import Form from 'elements/Form';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { CreateConfig, GetConfig, SmtpTest } from 'state/Setup';
import { SetupSteps } from '../../../shared/setupSteps';
import router from 'next/router';
import t from 'i18n';
import { getHostname } from 'shared/sys.helper';
import { HttpStatus } from 'shared/types/http-status.enum';
import { useEffect, useState } from 'react';

export default function SysadminConfig() {
  const [noConfigFoundConfirmed, setNoConfigFoundConfirmed] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      hostName: getHostname(),
      mapifyApiKey: '',
      postgresHostName: 'db',
      postgresDb: 'hb-db',
      postgresUser: 'postgres',
      postgresPassword: 'PASSWORD',
      postgresPort: 5432,
      smtpUrl:
        'smtp://info@helpbuttons.org:some-string@smtp.some-provider.com:587',
    },
  });

  useEffect(() => {
    if (!noConfigFoundConfirmed) {
      store.emit(
        new GetConfig(
          () => {alertService.error('u shouldnt be here'); router.push('/')},
          (error) => {
            if (error == 'not-found') {
              setNoConfigFoundConfirmed(true);
            } else {
              alertService.error(JSON.stringify(error));
            }

            return;
          },
        ),
      );
    }
  }, [noConfigFoundConfirmed]);

  const onSubmit = (data) => {
    store.emit(
      new CreateConfig(
        data,
        () => {
          router.push({
            pathname: SetupSteps.CREATE_ADMIN_FORM,
          });
        },
        (err, data) => {
          if (err.statusCode === HttpStatus.SERVICE_UNAVAILABLE) {
            if (err.message === 'db-hostname-error') {
              alertService.error(
                t(
                  err.message,
                  `Database connection error, could not connect to database host '${data.postgresHostName}' not found`,
                ),
              );
            } else if (err.message === 'db-connection-error') {
              alertService.error(
                t(
                  err.message,
                  `Database connection error, wrong credentials?`,
                ),
              );
            } else {
              alertService.error(
                t(
                  'other-problem',
                  `Problem:: ${JSON.stringify(err)}`,
                ),
              );
            }
          }
          if (err.statusCode === HttpStatus.CONFLICT) {
            alertService.warn(
              t(
                'config-conflict',
                `You already created a configuration, please remove config.json from the api directory. Or if you want to continue this installation <a href="${SetupSteps.CREATE_ADMIN_FORM}">create an admin account</a>, or <a href="${SetupSteps.FIRST_OPEN}">configure your network</a>?`,
              ),
            );
          }
        },
      ),
    );
  };

  const onSmtpTest = (data) => {
    store.emit(
      new SmtpTest(data.smtpUrl, onSmtpSuccess, onSmtpError),
    );
  };

  const onSmtpError = (err) => {
    alertService.error(`${JSON.stringify(err)}`);
  };

  const onSmtpSuccess = () => {
    alertService.info(
      t('smtp-success', `SMTP connection succesful!`),
    );
  };

  return (
    <>
      {noConfigFoundConfirmed && (
        <Popup title="Save configurations" linkFwd={null}>
          <Form classNameExtra="saveSetup">
            <div className="publish_setup-first">
              <FieldText
                name="hostname"
                label={`${t('setup.hostname')}:`}
                placeholder="localhost"
                validationError={errors.description}
                classNameExtra="squared"
                {...register('hostName', { required: true })}
              />
              <FieldText
                name="mapifyApiKey"
                label="OpenCage ApiKey"
                classNameInput="squared"
                validationError={errors.mapifyApiKey}
                {...register('mapifyApiKey', { required: true })}
              />
              <FieldText
                name="postgresUser"
                label={`${t('setup.postgresUser')}`}
                {...register('postgresUser')}
              ></FieldText>
              <FieldText
                name="postgresPassword"
                label={`${t('setup.postgresPassword')}`}
                {...register('postgresPassword')}
              ></FieldText>
              <FieldText
                name="postgresDb"
                label={`${t('setup.postgresDb')}`}
                {...register('postgresDb')}
              ></FieldText>

              <FieldText
                name="postgresHostName"
                label={`${t('setup.postgresHostName')}:`}
                {...register('postgresHostName')}
              ></FieldText>

              <FieldText
                name="postgresPort"
                label={`${t('setup.postgresPort')}:`}
                {...register('postgresPort')}
              ></FieldText>

              <FieldText
                name="smtpUrl"
                label={`${t('setup.smtpUrl')}:`}
                {...register('smtpUrl')}
              ></FieldText>
            </div>
            <div className="form__btn-wrapper">
              <Btn
                btnType={BtnType.splitIcon}
                caption={t('setup.test-smtp-button')}
                contentAlignment={ContentAlignment.center}
                isSubmitting={isSubmitting}
                onClick={handleSubmit(onSmtpTest)}
              />
              <Btn
                btnType={BtnType.splitIcon}
                caption={t('setup.connect-db-save-config')}
                contentAlignment={ContentAlignment.center}
                isSubmitting={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              />
            </div>
          </Form>
        </Popup>
      )}
    </>
  );
}
