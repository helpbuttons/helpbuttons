//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import React, { useEffect, useState } from 'react';
import Form from 'elements/Form';

import Popup from 'components/popup/Popup';
import ButtonType from 'components/button/ButtonType';

import FieldLocation from 'elements/Fields/FieldLocation';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import FieldText from 'elements/Fields/FieldText';
import FormSubmit from 'elements/Form/FormSubmit';
import ButtonShare from 'components/button/ButtonShare';
// import ButtonNewDate from 'components/button/ButtonNewDate';
import FieldTags from 'elements/Fields/FieldTags';
import { useRef } from 'store/Store';
import { buttonTypes } from 'shared/buttonTypes';
// import FieldImageUpload from "elements/Fields/FieldImageUpload";
import { GlobalState, store } from 'pages';
import { FieldImageUpload } from 'elements/Fields/FieldImageUpload';
import { Network } from 'shared/entities/network.entity';
import FieldDate from 'elements/Fields/FieldDate';
import t from 'i18n';
import { LoadabledComponent } from 'components/loading';

export default function ButtonForm({
  onSubmit,
  watch,
  reset,
  getValues,
  handleSubmit,
  register,
  errors,
  control,
  setValue,
  setFocus,
  isSubmitting,
  title,
}) {
    const selectedNetwork: Network = useRef(
      store,
      (state: GlobalState) => state.networks.selectedNetwork,
    );
    const buttonDraft = useRef(
      store,
      (state: GlobalState) => state.explore.draftButton,
    );

  const [date, setDate] = useState('');

  const [errorMsg, setErrorMsg] = useState(undefined);

  const [isReadyForLocationAndTime, setIsReadyForLocationAndTime] =
    useState(false);
  const [markerColor, setMarkerColor] = useState(null);
  useEffect(() => {
    if (buttonDraft) {
      reset(buttonDraft);
    }
    const subscription = watch((value, { name, type }) => {
      const values = getValues();
      if (
        values?.image?.length > 0 &&
        values.title.length > 0 &&
        values.type.length > 0
      ) {
        setIsReadyForLocationAndTime(true);
      } else {
        setIsReadyForLocationAndTime(false);
      }
      const buttonType = buttonTypes.find((buttonType) => {
        return buttonType.name === values.type;
      });
      if (buttonType) {
        setMarkerColor(buttonType.cssColor);
      }
    });
    return () => subscription.unsubscribe();
  }, [buttonDraft, watch]);

  return (
    <LoadabledComponent loading={!selectedNetwork}>
      <Popup title={title} linkFwd="/Explore">
        <Form
          onSubmit={handleSubmit(onSubmit)}
          classNameExtra="publish_btn"
        >
          <div className="publish_btn-first">
            <ButtonType
              name="type"
              label={t('button.typeLabel')}
              {...register('type', { required: true })}
              validationError={errors.type}
              explain={t('button.typeExplain')}
            />
            <FieldText
              name="title"
              label={t('button.titleLabel')}
              placeholder={t('button.placeHolderTitle')}
              validationError={errors.title}
              watch={watch}
              setValue={setValue}
              explain={"Short title to know what's your button about"}
              setFocus={setFocus}
              {...register('title', { required: true })}
            />
            <FieldTextArea
              label={t('button.descriptionLabel')}
              name="description"
              placeholder={t('button.placeHolderDescription')}
              validationError={errors.description}
              classNameExtra="squared"
              watch={watch}
              setValue={setValue}
              setFocus={setFocus}
              {...register('description', {
                required: true,
                minLength: 10,
              })}
            />

            {/* TODO: Warning: Cannot update a component (`ButtonNew`) while rendering a different component (`FieldTags`). To locate the bad setState() call inside `FieldTags`, follow the stack trace as described in https://reactjs.org */}
            <FieldTags
              label={t('button.tagsLabel')}
              placeholder={t('common.add')}
              validationError={errors.tags}
              setTags={(tags) => {
                setValue('tags', tags)
              }}
              tags={watch('tags')}
            />
          </div>
          <div className="publish_btn-scd">
            <FieldImageUpload
              name="image"
              label={t('button.imagesLabel')}
              // width={55}
              // height={125}
              setValue={setValue}
              control={control}
              {...register('image', { required: true })}
              validationError={errors.image}
            />
            <>
              <FieldLocation
                label={t('button.whereLabel')}
                updateMarkerPosition={([lat, lng]) => {
                  setValue('latitude', lat);
                  setValue('longitude', lng);
                }}
                updateAddress={(address) => {
                  setValue('address', address);
                }}
                markerAddress={watch('address')}
                markerImage={watch('image')}
                markerCaption={watch('title')}
                markerColor={markerColor}
                selectedNetwork={selectedNetwork}
                validationError={errors.location}
              />
              <FieldDate
                dateType={watch('when.type')}
                dates={watch('when.dates')}
                setDateType={(value) => setValue('when.type', value)}
                setDate={(value) => setValue('when.dates', value)}
                title={t('button.whenLabel')}
              />
            </>
            {/* <ButtonNewDate title="When ?" setDate={setDate} date={date} /> */}
            <ButtonShare />
          </div>
          <div className="publish__submit">
            <FormSubmit
              classNameExtra="create_btn"
              title={t('common.publish')}
              isSubmitting={isSubmitting}
            />
          </div>
        </Form>
      </Popup>
    </LoadabledComponent>
  );
}
