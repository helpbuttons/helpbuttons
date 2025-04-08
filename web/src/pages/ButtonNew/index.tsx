import ButtonForm from 'components/button/ButtonForm';
import { GlobalState, store } from 'state';
import { CreateButton, SaveButtonDraft, UpdateCachedHexagons, updateCurrentButton } from 'state/Explore';
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
    isCustomAddress: false
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
            router.push(`/ButtonFile/${buttonData.id}`);
          }else{
            alertService.success(t('button.created'))
            store.emit(new UpdateCachedHexagons([]))
            router.push(`/ButtonFile/${buttonData.id}`);
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
      // Router.push({
      //   pathname: '/Login',
      //   query: { returnUrl: 'ButtonNew' },
      // });
    }else if(err.errorName == ErrorName.invalidDates){
      alertService.error(t('button.invalidDates'))
    }else if(err.errorName == ErrorName.InvalidMimetype){
      alertService.error(err.caption);
    }else if(err.errorName == ErrorName.validationError){
      alertService.error(err.caption);
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
