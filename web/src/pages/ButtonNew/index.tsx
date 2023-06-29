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
import { ErrorName } from 'shared/types/error.list';
import t from 'i18n';
import { Button } from 'shared/entities/button.entity';
import { CreateNewPost } from 'state/Posts';
import { readableDate } from 'shared/date.utils';

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
      when: { dates: [], type: null },
    },
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

  const jumpToExploreButton = (buttonData) => {
    router.push(`/Explore#?lat=${buttonData.latitude}&lng=${buttonData.longitude}`);
  }
  const onSuccess = (buttonData : Button) => {
    console.log(buttonData)
    store.emit(
      new CreateNewPost(
        buttonData.id,
        {
          message: t('button.firstPost', [readableDate(buttonData.created_at)], true)
        },
        () => {
          jumpToExploreButton(buttonData)
        },
        (errorMessage) => {
          console.error(errorMessage)
          jumpToExploreButton(buttonData)
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
        title={t('common.publishTitle', ['button'])}
      ></ButtonForm>
    </>
  );
}
