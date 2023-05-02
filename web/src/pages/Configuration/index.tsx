import NetworkForm from 'components/network/NetworkForm';
import Popup from 'components/popup/Popup';
import DebugToJSON from 'elements/Debug';
import t from 'i18n';
import router from 'next/router';
import { GlobalState, store } from 'pages';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { LocalStorageVars, localStorageService } from 'services/LocalStorage';
import { NetworkDto } from 'shared/dtos/network.dto';
import { updateExploreMapZoom, updateMapCenter } from 'state/Explore';
import { FetchDefaultNetwork, UpdateNetwork } from 'state/Networks';
import { useRef } from 'store/Store';

export default Configuration;

function Configuration() {
  const selectedNetwork: NetworkDto = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );

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

  useEffect(() => {
    if(selectedNetwork){
      reset(selectedNetwork);
    }
  }, [selectedNetwork])
  const onSubmit = (data) => {
    store.emit(new UpdateNetwork({
      name: data.name,
      description: data.description,
      radius: 10,
      latitude: data.latitude,
      longitude: data.longitude,
      tags: data.tags,
      privacy: data.privacy,
      logo: data.logo,
      jumbo: data.jumbo,
      zoom: data.zoom,
      address: data.address,
      hexagons: data.hexagons,
      resolution: data.resolution
    },
      () => {
        const onComplete = (network) => {
          store.emit(new updateMapCenter([network.latitude, network.longitude]))
          store.emit(new updateExploreMapZoom(network.zoom))
          localStorageService.remove(LocalStorageVars.EXPLORE_SETTINGS)
          alertService.info(t('common.saveSuccess', ['Configuration']))
          router.replace('/HomeInfo');
        }
        store.emit(new FetchDefaultNetwork(onComplete, (error) => {console.log(error)}));
    }, 
    (err) => {

      if(err?.message.indexOf('validation-error') === 0)
      {
        const mimetypeError = 'invalid-mimetype-';
        if(err?.validationErrors?.jumbo && err.validationErrors.jumbo.indexOf(mimetypeError) === 0 ){
            const mimetype = err.validationErrors.jumbo.substr(mimetypeError.length);
            const mimetypeErrorMessage = t('common.invalidMimeType', ['jumbo',mimetype]);
            setError('jumbo',{ type: 'custom', message: mimetypeErrorMessage
          })
        }else if(err?.validationErrors?.logo && err.validationErrors.logo.indexOf(mimetypeError) === 0 ){
          const mimetype = err.validationErrors.logo.substr(mimetypeError.length);
          const mimetypeErrorMessage = t('common.invalidMimeType', ['logo',mimetype]);
            setError('logo',{ type: 'custom', message: mimetypeErrorMessage
          })
        }else {
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
        <Popup title={t('configuration.title')} LinkFwd="/Profile">
          
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
          selectedNetwork={selectedNetwork}
        />
        </Popup>
      )}
    </>
  );
}
