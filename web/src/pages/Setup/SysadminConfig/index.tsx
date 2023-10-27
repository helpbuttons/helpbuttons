// IF sql and email are not set... show form!
//Form component with the main fields for signup in the platform
//imported from libraries
//imported react components
import Popup from 'components/popup/Popup';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';

//imported internal classes, variables, files or functions
import FieldText from 'elements/Fields/FieldText';
import Form from 'elements/Form';
import { GlobalState, store } from 'pages';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { CreateConfig, SmtpTest } from 'state/Setup';
import { SetupSteps } from '../../../shared/setupSteps';
import router from 'next/router';
import t from 'i18n';
import { getUrlOrigin } from 'shared/sys.helper';
import { HttpStatus } from 'shared/types/http-status.enum';
import { useRef } from 'store/Store';
import { useEffect, useState } from 'react';

export default function SysadminConfig() {

  const {
    register,
    handleSubmit,
    formState: { errors},
    watch,
    setValue
  } = useForm({
    defaultValues: {
      hostName: '',
      mapifyApiKey: '',
      postgresHostName: 'db',
      postgresDb: 'hb-db',
      postgresUser: 'postgres',
      postgresPassword: 'PASSWORD',
      postgresPort: 5432,
      smtpUrl:
        'smtp://info@helpbuttons.org:some-string@smtp.some-provider.com:587',
        from: "'helpbuttons' <helpbuttons@coletivos.org>"
    },
  });

  const config = useRef(store, (state: GlobalState) => state.config);


  const [isSubmitting, setIsSubmitting] = useState(false)
  const onSubmit = (data) => {
    setIsSubmitting(true)
    if (config)
    {
      router.push({
        pathname: '/',
      });
    }
    store.emit(
      new CreateConfig(
        data,
        () => {
          setTimeout(() => {
            router.push({
              pathname: SetupSteps.CREATE_ADMIN_FORM,
            });
          }, 2000);
        },
        (err, data) => {
          setIsSubmitting(false)
          if (err.statusCode === HttpStatus.SERVICE_UNAVAILABLE) {
            if (err.message === 'db-hostname-error') {
              alertService.error(
                t(
                  err.message,
                  [data.postgresHostName] 
                ),
              );
            } else if (err.message === 'db-connection-error') {
              alertService.error(
                t(
                  err.message
                ),
              );
            } else {
              alertService.error(
                t(
                  err.message
                ),
              );
            }
          }
          if (err.statusCode === HttpStatus.CONFLICT) {
            alertService.warn(
              t(
                'config-conflict',
                [SetupSteps.CREATE_ADMIN_FORM,SetupSteps.FIRST_OPEN]
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
    if(err?.response)
    {
      alertService.error(err?.response.message);
    }else{
      alertService.error(`${JSON.stringify(err)}`);
    }
  };

  const onSmtpSuccess = () => {
    alertService.info(
      t('smtp-success'),
    );
  };

  useEffect(() => {
    const hostname = watch('hostName')
    if(window && hostname == ''){
      setValue('hostName', getUrlOrigin())
    }
  }, [])

  return (
    <>
      {!config && (
        <Popup title="Save configurations" linkFwd={null}>
          <Form classNameExtra="saveSetup">
            <div className="publish_setup-first">
              <FieldText
                name="hostname"
                label={`${t('setup.hostname')}:`}
                placeholder="http://localhost:port"
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
              <FieldText
                name="from"
                label={`${t('setup.from')}:`}
                placeholder="'helpbuttons.org' <helpbuttons@coletivos.org>"
                validationError={errors.from}
                classNameExtra="squared"
                {...register('from', { required: true })}
              />
            </div>
            <div className="form__btn-wrapper">
              <Btn
                btnType={BtnType.submit}
                caption={t('setup.test-smtp-button')}
                contentAlignment={ContentAlignment.center}
                isSubmitting={isSubmitting}
                onClick={handleSubmit(onSmtpTest)}
              />
              <Btn
                submit={true}
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
