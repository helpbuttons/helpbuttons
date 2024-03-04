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
import { ServerPropsService } from 'services/ServerProps';
import { useStore } from 'store/Store';

export default function ButtonNew({metadata,selectedNetwork,config}) {
  const defaultValues = {
    image: null,
    description: '',
    latitude: selectedNetwork.exploreSettings.center[0],
    longitude: selectedNetwork.exploreSettings.center[1],
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

  const jumpToExploreButton = (buttonData) => {
    router.push(`/Explore?lat=${buttonData.latitude}&lng=${buttonData.longitude}`);
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
    }else{
      console.error(JSON.stringify(err))
    }
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
  try {
    const serverProps = await ServerPropsService.general('Home', ctx);
    return { props: serverProps };
  } catch (err) {
    console.log(err);
    return {
      props: {
        metadata: null,
        selectedNetwork: null,
        config: null,
        noconfig: true,
      },
    };
  }
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