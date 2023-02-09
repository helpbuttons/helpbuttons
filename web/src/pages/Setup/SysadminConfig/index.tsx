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
import { CreateConfig, SmtpTest } from 'state/Setup';
import { HttpStatus } from 'services/HttpService/http-status.enum';
import { SetupSteps } from '../../../shared/setupSteps';
import router from 'next/router';
import t from 'i18n';
import { getHostname } from 'shared/sys.helper';

export default function SysadminConfig() {
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
      leafletTiles:
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      postgresHostName: 'db',
      postgresDb: 'hb-db',
      postgresUser: 'postgres',
      postgresPassword: 'PASSWORD',
      postgresPort: 5432,
      smtpUrl:
        'smtp://info@helpbuttons.org:some-string@smtp.some-provider.com:587',
    },
  });

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
              alertService.error(t(err.message,`Database connection error, could not connect to database host '${data.postgresHostName}' not found`));
            } else if (err.message === 'db-connection-error') {
              alertService.error(t(err.message,`Database connection error, wrong credentials?`));
            }else {
              alertService.error(t("other-problem",`Problem:: ${JSON.stringify(err)}`));
            }
            
          }
          if (err.statusCode === HttpStatus.CONFLICT) {
            alertService.warn(t("config-conflict", `You already created a configuration, please remove config.json from the api directory. Or if you want to continue this installation <a href="${SetupSteps.CREATE_ADMIN_FORM}">create an admin account</a>, or <a href="${SetupSteps.FIRST_OPEN}">configure your network</a>?`))
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
    alertService.info(t('smtp-success',`SMTP connection succesful!`));
  };

  return (
    <>
      <Popup title="Save configurations" linkFwd={null}>
        <Form classNameExtra="saveSetup">
          <div className="publish_setup-first">
            <FieldText
              name="hostname"
              label={`${t("hostname","Hostname")}:`}
              placeholder="localhost"
              validationError={errors.description}
              classNameExtra="squared"
              {...register('hostName', { required: true })}
            />
            {/* <FieldText
              name="mapifyApiKey"
              label={`${t("hostname","Hostname")}:`}
              label="Mapify ApiKey"
              placeholder="APIKEY"
              {...register('mapifyApiKey')}
            ></FieldText> */}
            {/* <FieldText
              name="leafletTiles"
              label="Leaflet Tiles"
              {...register('leafletTiles')}
            ></FieldText> */}
{/* 
            <FieldTags
              label="domains allowed"
              name="domainsAllowed"
              control={control}
              validationError={errors.tags}
              watch={watch}
            /> */}

            <FieldText
              name="postgresUser"
              label={`${t("postgresUser","postgresql username")}:`}
              {...register('postgresUser')}
            ></FieldText>
            <FieldText
              name="postgresPassword"
              label={`${t("postgresPassword","postgresql password")}:`}
              {...register('postgresPassword')}
            ></FieldText>
            <FieldText
              name="postgresDb"
              label={`${t("postgresDb","postgresql database name")}:`}
              {...register('postgresDb')}
            ></FieldText>

            <FieldText
              name="postgresHostName"
              label={`${t("postgresHostName","postgresql hostname")}:`}
              {...register('postgresHostName')}
            ></FieldText>

            <FieldText
              name="postgresPort"
              label={`${t("postgresPort","postgresql port")}:`}
              {...register('postgresPort')}
            ></FieldText>

            <FieldText
              name="smtpUrl"
              label={`${t("smtpUrl","SMTP url")}:`}
              {...register('smtpUrl')}
            ></FieldText>
          </div>
          <div className="form__btn-wrapper">
            <Btn
              btnType={BtnType.splitIcon}
              caption={t("test-smtp-button","Test smtp connection")}
              contentAlignment={ContentAlignment.center}
              isSubmitting={isSubmitting}
              onClick={handleSubmit(onSmtpTest)}
            />
            <Btn
              btnType={BtnType.splitIcon}
              caption={t("connect-db-save-config","Test database connection, save configuration and continue")}
              contentAlignment={ContentAlignment.center}
              isSubmitting={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </Form>
      </Popup>
    </>
  );
}
