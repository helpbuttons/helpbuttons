import NetworkForm from 'components/network/NetworkForm';
import Popup from 'components/popup/Popup';
import router from 'next/router';
import { GlobalState, store } from 'pages';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
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
    },
      () => {
        const onComplete = (network) => {
          store.emit(new updateMapCenter(network.location.coordinates))
          store.emit(new updateExploreMapZoom(network.zoom))
          alertService.info('done!, your network should be on the db')
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
            const mimetypeErrorMessage = `invalid image mimetype: "${mimetype}"`;
            setError('jumbo',{ type: 'custom', message: mimetypeErrorMessage
          })
        }else if(err?.validationErrors?.logo && err.validationErrors.logo.indexOf(mimetypeError) === 0 ){
          const mimetype = err.validationErrors.logo.substr(mimetypeError.length);
          const mimetypeErrorMessage = `invalid image mimetype: "${mimetype}"`;
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
        <Popup title="Configure network" LinkFwd="/Profile">
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
          captionAction="Save"
          linkFwd="/Profile"
          description=""
          selectedNetwork={selectedNetwork}
        />
        </Popup>
      )}
    </>
  );
}
