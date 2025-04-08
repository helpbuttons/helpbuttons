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
import dconsole from 'shared/debugger';

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

    router.push(`/Explore?lat=${data.lat}&lng=${data.lng}&btn=${data.id}`);
  };

  const onError = (err) => {
    if (err.errorName == ErrorName.invalidDates) {
      alertService.error(t('button.invalidDates'));
    } else if (err.errorName == ErrorName.InvalidMimetype) {
      alertService.error(t('validation.invalidMimeType'));
    } else if (err.caption) {
      alertService.error(err.caption);
    } else {
      console.error(JSON.stringify(err));
    }

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
          store.emit(new updateCurrentButton(buttonFetched))
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
      ></ButtonForm>
    }
    </>
  );
}
