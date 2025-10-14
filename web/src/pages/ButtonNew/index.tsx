import ButtonForm from 'components/button/ButtonForm';
import { GlobalState, store } from 'state';
import { CreateButton, SaveButtonDraft, UpdateCachedHexagons } from 'state/Explore';
import { alertService } from 'services/Alert';
import { useForm } from 'react-hook-form';
import router from 'next/router';
import { ErrorName } from 'shared/types/error.list';
import t from 'i18n';
import { Button } from 'shared/entities/button.entity';
import { CreateNewPost } from 'state/Posts';
import { readableDate } from 'shared/date.utils';
import { useEffect, useState } from 'react';
import { NextPageContext } from 'next';
import { setMetadata } from 'services/ServerProps';
import { useStore } from 'state';
import Loading from 'components/loading';
import { MainPopupPage, SetMainPopup } from 'state/HomeInfo';
import { useMetadataTitle } from 'state/Metadata';
import { useSelectedNetwork } from 'state/Networks';
import { markerFocusZoom } from 'components/map/Map/Map.consts';

export default function ButtonNew({ metadata }) {
  const selectedNetwork = useSelectedNetwork()

  useMetadataTitle(t('menu.create'))

  return (
    <>
    {selectedNetwork?.exploreSettings?.center ? 
      <ButtonNewForm selectedNetwork={selectedNetwork} />
     : <Loading/>
    }
    </>
  );
}

export const onButtonValidationError = (err, setError) => {
  if(err.errorName == ErrorName.invalidDates){
    alertService.error(t('button.invalidDates'))
    setError('eventStart', { type: 'server', message: t('button.invalidDates') });
  }else if(err.errorName == ErrorName.InvalidMimetype){
    alertService.error(err.caption);
  }else if(err.errorName == ErrorName.validationError){
    alertService.error(err.caption);
  }else{
    console.error(JSON.stringify(err))
  }
};

function ButtonNewForm({ selectedNetwork }) {
  const defaultValues = {
    image: null,
    description: '',
    latitude: null,
    longitude: null,
    type: '',
    tags: [],
    title: '',
    images: [],
    radius: 1,
    address: null,
    when: { dates: [], type: null },
    hideAddress: selectedNetwork.hideLocationDefault,
    eventData: null,
    isCustomAddress: false,
    eventStart: null
  };
  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
    setFocus,
    control,
    reset,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors
  } = useForm({
    defaultValues
  });

  register("address", { required: true })  

  const [isSubmitting, setIsSubmitting] = useState(false)
  const onSubmit = (data) => {
    setIsSubmitting(() => true)
    store.emit(
      new CreateButton(
        data,
        selectedNetwork.id,
        onSuccess,
        onError,
      ),
    );
  };

  const onSuccess = (buttonData : Button) => {
    store.emit(new SaveButtonDraft(defaultValues));
    store.emit(
      new CreateNewPost(
        buttonData.id,
        {
          message: t('button.firstPost', [readableDate(buttonData.created_at)], true)
        },
        (data) => {
          if(buttonData.awaitingApproval)
          {
            setIsSubmitting(() => false)
            alertService.info(t('moderation.awaitingApproval'));
            router.push(`/Explore`);
          }else{
            store.emit(new UpdateCachedHexagons([]))
            router.push(`/Explore/${markerFocusZoom}/${buttonData.latitude}/${buttonData.longitude}/${buttonData.id}`);
            alertService.success(t('button.created'))
          }
        },
        (errorMessage) => {
          alertService.error(t('button.errorCreated'))
          console.error(errorMessage)
        },
      ),
    );    
  };
  const onError = (err) => {
    if (err.errorName == ErrorName.NeedToBeRegistered) {
      store.emit(new SaveButtonDraft(getValues()));
      alertService.error(err.caption);
      store.emit(new SetMainPopup(MainPopupPage.LOGIN))
    }else{
      onButtonValidationError(err, setError)
    }
    setIsSubmitting(() => false)
  };

  const {loadedDraft} = useButtonDraft({watch, getValues, reset, defaultValues})
  return (
    <>
    {loadedDraft &&
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
        title={t('common.publishTitle', ['_helpbutton_'])}
        clearErrors={clearErrors}
      ></ButtonForm>
    }
    </>
  );
}


function useButtonDraft({watch, getValues, reset, defaultValues}) {
  const buttonDraft = useStore(
    store,
    (state: GlobalState) => state.explore.draftButton,
    false
  );
  const [watchedValues, setWatchedValues] = useState(JSON.stringify(watch()))
  const watchAllFields = watch()
  const [loadedDraft, setLoadedDraft] = useState(false);

  useEffect(() => {
    if(!loadedDraft && buttonDraft !== false)
    {
      if(buttonDraft)
      {
        reset(buttonDraft)
      }else{
        reset(defaultValues)
      }
      setLoadedDraft(() => true)
    }
      
  }, [buttonDraft])
  useEffect(() => {
    
    if(JSON.stringify(watchAllFields) != watchedValues)
    {
      setWatchedValues((prevWatchedFields) => {
        return JSON.stringify(watchAllFields)
      })
    }
  }, [watchAllFields])

  useEffect(() => {
    store.emit(new SaveButtonDraft(getValues()));
  }, [watchedValues])

  return {loadedDraft}
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  return setMetadata(t('menu.create'), ctx)
};
