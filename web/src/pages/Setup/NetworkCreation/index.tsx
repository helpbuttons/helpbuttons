import NetworkForm from 'components/network/NetworkForm';
import Popup from 'components/popup/Popup';
import t from 'i18n';
import router from 'next/router';
import { GlobalState, store } from 'pages';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { SetupSteps } from 'shared/setupSteps';
import { getLocale } from 'shared/sys.helper';
import { Role } from 'shared/types/roles';
import { CreateNetwork, FetchDefaultNetwork } from 'state/Networks';
import { useRef } from 'store/Store';

// name, description, logo, background image, button template, color pallete, colors
export default NetworkCreation;

function NetworkCreation() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setFocus,
    control,
    setValue,
    watch,
    setError,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      jumbo: '',
      tags: [],
      privacy: 'public',
      address: '',
      exploreSettings: null,
      buttonTemplates: JSON.parse('[{"name":"offer","caption":"Offer","color":"custom","cssColor":"#FFDD02"},{"name":"need","caption":"Need","color":"custom","cssColor":"#19AF96"},{"caption":"Business","name":"business","cssColor":"#071315","customFields":[]},{"caption":"Event","name":"event","cssColor":"#c5d51b","customFields":[{"type":"event"}]},{"caption":"Selling","name":"selling","cssColor":"#d51bd1","customFields":[{"type":"price"}]}]'),
      backgroundColor: '#FFDD02',
      textColor: '#0E0E0E',
      inviteOnly: false,
      currency: 'EUR',
      locale: 'en',
      nomeclature: 'Helpbutton',
      nomeclaturePlural: 'Helpbuttons'
    },
  });

  const loggedInUser = useRef(
    store,
    (state: GlobalState) => state.loggedInUser,
  );
  register("exploreSettings", { required: true })
  const onSubmit = (data) => {

    store.emit(
      new CreateNetwork(
        {
          name: data.name,
          description: data.description,
          tags: data.tags,
          privacy: 'public',
          logo: data.logo,
          jumbo: data.jumbo,
          exploreSettings: data.exploreSettings,
          backgroundColor: data.backgroundColor,
          textColor: data.textColor,
          buttonTemplates: data.buttonTemplates,
          inviteOnly: data.inviteOnly,
          currency: data.currency,
          nomeclature: data.nomeclature,
          nomeclaturePlural: data.nomeclaturePlural,
          locale: data.locale
        },
        () => {
          const onComplete = () => {
            alertService.info(t('common.saveSuccess', ['instance']));
            let url = '/HomeInfo';
            if(getLocale() !=  data.locale )
            {
              url = `/${data.locale}/${url}`
            }
            router.push(url)
          };
          store.emit(
            new FetchDefaultNetwork(onComplete, (error) => {
              console.log(error);
            }),
          );
        },
        (err) => {
          if (err?.message.indexOf('validation-error') === 0) {
            const mimetypeError = 'invalid-mimetype-';
            if (
              err?.validationErrors?.jumbo &&
              err.validationErrors.jumbo.indexOf(mimetypeError) === 0
            ) {
              const mimetype = err.validationErrors.jumbo.substr(
                mimetypeError.length,
              );
              const mimetypeErrorMessage = t(
                'common.invalidMimeType',
                ['jumbo', mimetype],
              );
              setError('jumbo', {
                type: 'custom',
                message: mimetypeErrorMessage,
              });
            } else if (
              err?.validationErrors?.logo &&
              err.validationErrors.logo.indexOf(mimetypeError) === 0
            ) {
              const mimetype = err.validationErrors.logo.substr(
                mimetypeError.length,
              );
              const mimetypeErrorMessage = t(
                'common.invalidMimeType',
                ['logo', mimetype],
              );
              setError('logo', {
                type: 'custom',
                message: mimetypeErrorMessage,
              });
            } else {
              alertService.warn(
                `Validation errors ${JSON.stringify(err)}`,
              );
            }
          } else {
            console.log(err);
          }
        },
      ),
    );
  };
  const selectedLocale = watch('locale')
  useEffect(() => {
    if(selectedLocale){
      if(selectedLocale == 'es')
      {
        setValue('nomeclature', 'boton de ayuda')
        setValue('nomeclaturePlural', 'botones de ayuda')
      }
      if(selectedLocale == 'en')
      {
        setValue('nomeclature', 'helpbutton')
        setValue('nomeclaturePlural', 'helpbuttons')
      }
    }
  }, [selectedLocale])

  return (
    <>
      {loggedInUser?.role == Role.admin && (
        <Popup title={t('setup.configureInstanceTitle')}>
          <NetworkForm
            captionAction={t('setup.finish')}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            register={register}
            setValue={setValue}
            watch={watch}
            setFocus={setFocus}
            isSubmitting={isSubmitting}
            control={control}
            errors={errors}
            linkFwd="/Setup/NetworkCreation"
            showClose={false}
            description={t('setup.configureInstanceDescription')}
          />
        </Popup>
      )}
    </>
  );
}
