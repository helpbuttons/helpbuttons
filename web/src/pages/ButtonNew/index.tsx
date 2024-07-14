import ButtonForm from 'components/button/ButtonForm';
import { GlobalState, store } from 'pages';
import { CreateButton, SaveButtonDraft, UpdateCachedHexagons } from 'state/Explore';
import Router from 'next/router';
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
import { useStore } from 'store/Store';
import { latLngToCell } from 'h3-js';
import { maxResolution } from 'shared/types/honeycomb.const';
import { setSSRLocale } from 'shared/sys.helper';

export default function ButtonNew({metadata, _selectedNetwork}) {

  const defaultValues = {
    image: null,
    description: '',
    latitude: _selectedNetwork.exploreSettings.center[0],
    longitude: _selectedNetwork.exploreSettings.center[1],
    type: '',
    tags: [],
    title: '',
    radius: 1,
    address: '',
    when: { dates: [], type: null },
    hideAddress: false,
    eventData: null
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
        _selectedNetwork.id,
        onSuccess,
        onError,
      ),
    );
  };

  const jumpToExploreButton = (buttonData) => {
    const cell = latLngToCell(buttonData.latitude, buttonData.longitude, maxResolution)
    router.push(`/Explore?lat=${buttonData.latitude}&lng=${buttonData.longitude}&hex=${cell}`);
  }
  const onSuccess = (buttonData : Button) => {
    store.emit(new SaveButtonDraft(defaultValues));
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
      alertService.error(t('button.invalidDates'))
    }else if(err.errorName == ErrorName.InvalidMimetype){
      alertService.error(t('validation.invalidMimeType'))
    }else{
      console.error(JSON.stringify(err))
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
      ></ButtonForm>
    }
    </>
  );
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  setSSRLocale(ctx.locale);
  return setMetadata(t('menu.create'), ctx)
};


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