import ButtonForm from 'components/button/ButtonForm';
import { GlobalState, store } from 'pages';
import { CreateButton, SaveButtonDraft, UpdateCachedHexagons } from 'state/Explore';
import { useRef } from 'store/Store';
import Router from 'next/router';
import { alertService } from 'services/Alert';
import { useForm } from 'react-hook-form';
import router from 'next/router';
import { defaultMarker } from 'shared/sys.helper';
import { ErrorName } from 'shared/types/error.list';
import t from 'i18n';
import { Button } from 'shared/entities/button.entity';
import { CreateNewPost } from 'state/Posts';
import { readableDate } from 'shared/date.utils';
import { useEffect, useState } from 'react';

export default function ButtonNew() {
  const defaultValues = {
    image: null,
    description: '',
    latitude: defaultMarker.latitude,
    longitude: defaultMarker.longitude,
    type: '',
    tags: [],
    title: '',
    radius: 1,
    address: '',
    when: { dates: [], type: null },
    hideAddress: false,
  };
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
    defaultValues
  });

  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  const onSubmit = (data) => {
    store.emit(
      new CreateButton(
        data,
        selectedNetwork.id,
        onSuccess,
        onError,
      ),
    );
  };

  const [loaded, setLoaded] = useState(false);
  const jumpToExploreButton = (buttonData) => {
    router.push(`/Explore#?lat=${buttonData.latitude}&lng=${buttonData.longitude}`);
  }
  const onSuccess = (buttonData : Button) => {
    store.emit(
      new CreateNewPost(
        buttonData.id,
        {
          message: t('button.firstPost', [readableDate(buttonData.created_at)], true)
        },
        (data) => {
          alertService.success(t('button.created'))
          store.emit(new UpdateCachedHexagons([]))
          jumpToExploreButton(buttonData)
        },
        (errorMessage) => {
          alertService.error(t('button.errorCreated'))
          console.error(errorMessage)
          // jumpToExploreButton(buttonData)
        },
      ),
    );    
  };
  const onError = (err) => {
    if (err.errorName == ErrorName.NeedToBeRegistered) {
      store.emit(new SaveButtonDraft(getValues()));
      alertService.error(err.caption);
      Router.push({
        pathname: '/Login',
        query: { returnUrl: 'ButtonNew' },
      });
    }else if(err.errorName == ErrorName.invalidDates){
      alertService.error('invalid dates')
    }else{
      console.error(JSON.stringify(err))
    }
  };

  useEffect(() => {
    if(!loaded)
    {
      reset(defaultValues)
      setLoaded(true)
    }
  }, [loaded])
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
        title={t('common.publishTitle', ['helpbutton'])}
      ></ButtonForm>
    </>
  );
}
