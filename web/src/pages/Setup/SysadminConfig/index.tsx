// IF sql and email are not set... show form!
//Form component with the main fields for signup in the platform
//imported from libraries
//imported react components
import Popup from 'components/popup/Popup';
import Btn, { BtnType, ContentAlignment } from 'elements/Btn';

//imported internal classes, variables, files or functions
import PopupSection from 'components/popup/PopupSection';
import FieldNumber from 'elements/Fields/FieldNumber';
import FieldTags from 'elements/Fields/FieldTags';
import FieldText from 'elements/Fields/FieldText';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import Form from 'elements/Form';
import FormSubmit from 'elements/Form/FormSubmit';
import { store } from 'pages';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { NavigateTo } from 'state/Routes';
import { CreateConfig, GetConfig, SmtpTest } from 'state/Setup';
import { useEffect } from 'react';
import { HttpStatus } from 'services/HttpService/http-status.enum';
import { useRouter } from 'next/router';
import { localStorageService, LocalStorageVars } from 'services/LocalStorage';
import { setupNextStep, SetupSteps } from '../steps';

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
      hostName: 'localhost',
      mapifyApiKey: '',
      leafletTiles:
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      postgresHostName: 'localhost',
      postgresDb: 'hb-db',
      postgresUser: 'postgres',
      postgresPassword: 'doesntmatter',
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

          setupNextStep(SetupSteps.CREATE_ADMIN_FORM);
        },
        (err, data) => {
          if (err.statusCode !== HttpStatus.CONFLICT) {
            alertService.error(`Problem:: ${JSON.stringify(err)}`);
          }
          if (err.statusCode === HttpStatus.CONFLICT) {
            alertService.warn(`You already created a configuration, please rmeove config.json from the api directory. Or if you want to continue this installation <a href="${SetupSteps.CREATE_ADMIN_FORM}">create an admin account</a>, or <a href="${SetupSteps.FIRST_OPEN}">configure your instance</a>?`)
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
    alertService.info(`SMTP connection succesful!`);
  };

  return (
    <>
      <Popup title="Save configurations" linkFwd="/Explore">
        <Form classNameExtra="saveSetup">
          <div className="publish_setup-first">
            <FieldText
              name="hostName"
              label="hostName:"
              placeholder="localhost"
              validationError={errors.description}
              classNameExtra="squared"
              {...register('hostName', { required: true })}
            />
            <FieldText
              name="mapifyApiKey"
              label="Mapify ApiKey"
              placeholder="APIKEY"
              {...register('mapifyApiKey')}
            ></FieldText>
            <FieldText
              name="leafletTiles"
              label="Leaflet Tiles"
              {...register('leafletTiles')}
            ></FieldText>

            <FieldTags
              label="domains allowed"
              name="domainsAllowed"
              control={control}
              validationError={errors.tags}
              watch={watch}
            />

            <FieldText
              name="postgresUser"
              label="Postgres User"
              {...register('postgresUser')}
            ></FieldText>
            <FieldText
              name="postgresPassword"
              label="Postgres password"
              {...register('postgresPassword')}
            ></FieldText>
            <FieldText
              name="postgresDb"
              label="Postgres DB name"
              {...register('postgresDb')}
            ></FieldText>

            <FieldText
              name="postgresHostName"
              label="Postgres hostname"
              {...register('postgresHostName')}
            ></FieldText>

            <FieldText
              name="postgresPort"
              label="Postgres port"
              {...register('postgresPort')}
            ></FieldText>

            <FieldText
              name="smtpUrl"
              label="Smtp URL"
              {...register('smtpUrl')}
            ></FieldText>
          </div>
          <div className="form__btn-wrapper">
            <Btn
              btnType={BtnType.splitIcon}
              caption="TEST SMTP"
              contentAlignment={ContentAlignment.center}
              isSubmitting={isSubmitting}
              onClick={handleSubmit(onSmtpTest)}
            />
            <Btn
              btnType={BtnType.splitIcon}
              caption="TEST DB & SAVE"
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
