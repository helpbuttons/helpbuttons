import NetworkForm from 'components/network/NetworkForm';
import Popup from 'components/popup/Popup';
import router from 'next/router';
import { store } from 'pages';
import Configuration from 'pages/Configuration';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { alertService } from 'services/Alert';
import { SetupSteps } from 'shared/setupSteps';
import { defaultMarker } from 'shared/sys.helper';
import { CreateNetwork, FetchDefaultNetwork } from 'state/Networks';

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
      name: "My permaculture network",
      description: "In this network we will use a map to share tools in-between our network",
      logo: "",
      jumbo: "",
      tags: [],
      latitude: defaultMarker.latitude,
      longitude: defaultMarker.longitude,
      zoom: 10,
      privacy: "public"
    }
  });

  const onSubmit = (data) => {
    store.emit(new CreateNetwork({
      name: data.name,
      description: data.description,
      radius: 10,
      latitude: data.latitude,
      longitude: data.longitude,
      tags: data.tags,
      privacy: "public",
      logo: data.logo,
      jumbo: data.jumbo,
      zoom: data.zoom,
    },
      () => {
        const onComplete = () => {
          alertService.info('done!, your network should be on the db')
          router.replace('/HomeInfo');
        }
        store.emit(new FetchDefaultNetwork(onComplete, onComplete));
        
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
        alertService.warn(`You already created an admin account, do you want to <a href="/Login">login</a>? Or you want to <a href="${SetupSteps.FIRST_OPEN}">configure your network</a>?`)
        console.log(err)
      }

    }));
  };

  useEffect(() => {
    store.emit(
      new FetchDefaultNetwork(
        () => {
          router.push({
            pathname: '/HomeInfo',
          });
        },
        (error) => {
          // do nothing, let the user configure the network
        },
      ),
    );
  }, []);

  return (
    <Popup title="Create your network">
    <NetworkForm
      captionAction="Next"
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
      description="Wizard to help on configuring your network"
    />
    </Popup>
  );
}
