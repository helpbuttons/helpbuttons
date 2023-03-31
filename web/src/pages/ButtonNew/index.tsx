import ButtonForm from 'components/button/ButtonForm';
import { GlobalState, store } from 'pages';
import { CreateButton, SaveButtonDraft } from 'state/Explore';
import { NavigateTo } from 'state/Routes';
import { useRef } from 'store/Store';
import Router from 'next/router';
import { alertService } from 'services/Alert';
import { useForm } from 'react-hook-form';
import router from 'next/router';
import { defaultMarker } from 'shared/sys.helper';

export default function ButtonNew() {
  const {
    register,
    handleSubmit,
    formState: {
      isDirty,
      dirtyFields,
      touchedFields,
      errors,
      isSubmitting,
    },
    setFocus,
    control,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      image: null,
      description: '',
      latitude: defaultMarker.latitude,
      longitude: defaultMarker.longitude,
      type: '',
      tags: [],
      title: '',
      radius: 1,
      address: '',
    },
  });

  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  const onSubmit = (data) => {
    store.emit(
      new CreateButton(data, selectedNetwork.id, 
        onSuccess({lat: data.latitude, lng: data.longitude}), 
        onError),
    );
  };

    const onSuccess = (location: {lat: number, lng: number}) => {
    router.push({
      pathname: '/Explore',
      query: location,
    });
  };

  const onError = (err, data) => {
    console.log('fail creating button')
    if (err == 'unauthorized') {
      alertService.error('You need to login or registering an account');
      Router.push({
        pathname: '/Login',
        query: { returnUrl: 'ButtonNew' },
      });
    } else {
      alertService.error(err);
    }
  };
  return (
    <>
      <ButtonForm
        watch={watch}
        reset={reset}
        getValues={getValues}
        handleSubmit={handleSubmit}
        register={register}
        errors={errors}
        control={control}
        setValue={setValue}
        setFocus={setFocus}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
      ></ButtonForm>
    </>
  );
}
