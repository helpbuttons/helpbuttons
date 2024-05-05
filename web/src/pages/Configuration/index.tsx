import NetworkForm from 'components/network/NetworkForm';
import Popup from 'components/popup/Popup';
import t from 'i18n';
import router, { useRouter } from 'next/router';
import { GlobalState, store } from 'pages';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { useToggle } from 'shared/custom.hooks';
import { Network } from 'shared/entities/network.entity';
import { UpdateExploreSettings } from 'state/Explore';
import { FetchDefaultNetwork, UpdateNetwork, UpdateNetworkBackgroundColor, UpdateNetworkTextColor } from 'state/Networks';
import { useRef } from 'store/Store';

export default Configuration;

function Configuration() {
  const selectedNetwork: Network = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  const [loadingNetwork, setLoadingNetwork] = useToggle(true)
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    control,
    setValue,
    watch,
    setError,
    reset,
    setFocus
  } = useForm({});

  const backgroundColor = watch('backgroundColor');
  useUpdateBackgroundColor(backgroundColor);

  const textColor = watch('textColor');
  useTextColor(textColor);
  const { pathname, asPath, query } = useRouter()

  useEffect(() => {
    if(selectedNetwork && loadingNetwork){
      setLoadingNetwork(false)
      reset(selectedNetwork);
    }
  }, [selectedNetwork])
  const onSubmit = (data) => {
    store.emit(new UpdateNetwork({
      name: data.name,
      description: data.description,
      tags: data.tags,
      privacy: data.privacy,
      logo: data.logo,
      jumbo: data.jumbo,
      exploreSettings: data.exploreSettings,
      backgroundColor: data.backgroundColor,
      textColor: data.textColor,
      buttonTemplates: data.buttonTemplates,
      inviteOnly: data.inviteOnly,
      locale: data.locale,
      currency: data.currency,
      nomeclature: data.nomeclature,
      nomeclaturePlural: data.nomeclaturePlural
    },
      () => {
        const onComplete = (network) => {
          store.emit(new UpdateExploreSettings(data.exploreSettings))
          alertService.info(t('common.saveSuccess', ['Configuration']))
          if(data.locale != 'en')
          {
            router.push(`/${data.locale}/HomeInfo`)
          }else{
            router.push({ pathname: '/HomeInfo' }, asPath, { locale: 'en' });
          }

        }
        store.emit(new FetchDefaultNetwork(onComplete, (error) => {console.log(error)}));
    }, 
    (err) => {

      if(err?.message.indexOf('validation-error') === 0)
      {
        const mimetypeError = 'invalid-mimetype-';
        if(err?.validationErrors?.jumbo && err.validationErrors.jumbo.indexOf(mimetypeError) === 0 ){
            const mimetype = err.validationErrors.jumbo.substr(mimetypeError.length);
            console.log(mimetype)
            const mimetypeErrorMessage = t('common.invalidMimeType', ['background image',mimetype]);
            setError('background image',{ type: 'custom', message: mimetypeErrorMessage
          })
        }else if(err?.validationErrors?.logo && err.validationErrors.logo.indexOf(mimetypeError) === 0 ){
          const mimetype = err.validationErrors.logo.substr(mimetypeError.length);
          const mimetypeErrorMessage = t('common.invalidMimeType', ['logo',mimetype]);
            setError('logo',{ type: 'custom', message: mimetypeErrorMessage
          })
        }else if(err?.validationErrors?.buttonTemplates){
          alertService.warn(err.validationErrors.buttonTemplates)
        }else{
          alertService.warn(`Validation errors ${JSON.stringify(err)}`)
        }
      }else{
        console.log(err)
      }

    }));
  };
  return (
    <>
      {selectedNetwork && (
        <Popup title={t('configuration.title')} linkBack="/Profile">
            <NetworkForm
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
              register={register}
              setValue={setValue}
              setFocus={setFocus}
              watch={watch}
              isSubmitting={isSubmitting}
              control={control}
              errors={errors}
              captionAction={t('common.save')}
              linkFwd="/Profile"
              description={t('configuration.description')}
              defaultExploreSettings={selectedNetwork.exploreSettings}
            />

        </Popup>
      )}
    </>
  );
}


const useUpdateBackgroundColor = (backgroundColor) => {
  useEffect(() => {
    if (backgroundColor) {
      store.emit(new UpdateNetworkBackgroundColor(backgroundColor));
    }
  }, [backgroundColor]);
};

const useTextColor = (textColor) => {
  useEffect(() => {
    if (textColor) {
      store.emit(new UpdateNetworkTextColor(textColor));
    }
  }, [textColor]);
};

