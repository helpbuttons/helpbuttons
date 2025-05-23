import ButtonForm from 'components/button/ButtonForm';
import { store } from 'state';
import {
  FindButton,
  UpdateButton,
  updateCurrentButton,
} from 'state/Explore';
import { alertService } from 'services/Alert';
import { Button } from 'shared/entities/button.entity';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UpdateButtonDto } from 'shared/dtos/button.dto';
import t from 'i18n';
import { useRouter } from 'next/router';
import { ErrorName } from 'shared/types/error.list';
import { markerFocusZoom } from 'components/map/Map/Map.consts';
import { onButtonValidationError } from 'pages/ButtonNew';

export default function ButtonEdit() {

  const {
    register,
    handleSubmit,
    formState: {
      isDirty,
      dirtyFields,
      touchedFields,
      errors,
    },
    control,
    reset,
    watch,
    setValue,
    getValues,
    setFocus,
    setError,
    clearErrors
  } = useForm();

  const [button, setButton] = useState<Button>(null);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [id, setId] = useState(null)
  const router = useRouter()
  const onSubmit = (data) => {
    setIsSubmitting(() => true)
    store.emit(
      new UpdateButton(id,
        data,
        onSuccess,
        onError,
      ),
    );
  };

  const onSuccess = (data) => {
    router.push(`/Explore/${markerFocusZoom}/${data.latitude}/${data.longitude}?btn=${data.id}`);
  };

  const onError = (err) => {
    onButtonValidationError(err, setError)

    setIsSubmitting(() => false);
  };
  useEffect(() => {
    if(!router.isReady){
      return;
    }
    setId(() =>  router.query.id as string)
    store.emit(
      new FindButton(
        router.query.id as string,
        (buttonFetched) => {
          setButton(buttonFetched);
          reset(buttonFetched);
        }
      ),
    );
  }, [router.isReady])

  return (
    <>
    {button &&
      <ButtonForm
        watch={watch}
        reset={reset}
        getValues={getValues}
        handleSubmit={handleSubmit}
        register={register}
        errors={errors}
        control={control}
        setFocus={setFocus}
        setValue={setValue}
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        title={t('common.editTitle', ['button'])}
        clearErrors={clearErrors}
      ></ButtonForm>
    }
    </>
  );
}
