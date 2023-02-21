//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from 'elements/Form';

import Popup from 'components/popup/Popup';
import ButtonType from 'components/button/ButtonType';

import FieldLocation from 'elements/Fields/FieldLocation';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import FormSubmit from 'elements/Form/FormSubmit';
import ButtonShare from 'components/button/ButtonShare';
import ButtonNewDate from 'components/button/ButtonNewDate';
import FieldTags from 'elements/Fields/FieldTags';
import { useRef } from 'store/Store';
import { NavigateTo } from 'state/Routes';
import FieldImageUpload from 'elements/Fields/FieldImageUpload';
import FieldDate from 'elements/Fields/FieldDate';
import FieldText from 'elements/Fields/FieldNumber';
import { buttonTypes } from 'shared/buttonTypes';
import FieldImageUploads from 'elements/Fields/FieldImagesUpload';
// import FieldImageUpload from "elements/Fields/FieldImageUpload";
import { GlobalState, store } from 'pages';

export default function ButtonForm({onSubmit}) {
    const selectedNetwork = useRef(
        store,
        (state: GlobalState) => state.networks.selectedNetwork,
      );
      const buttonDraft = useRef(
        store,
        (state: GlobalState) => state.explore.draftButton,
      );
    
      const [date, setDate] = useState('');
    
      const {
        register,
        handleSubmit,
        formState: { isDirty,dirtyFields, touchedFields, errors, isSubmitting },
        control,
        reset,
        watch,
        setValue,
        getValues
      } = useForm({
        defaultValues: {
          image: null,
          description: 'hlkdsahdlksah ldka',
          latitude: '41.6869',
          longitude: '-7.663206',
          type: '',
          tags: [],
          title: 'ma title',
        },
      });
    
      const [errorMsg, setErrorMsg] = useState(undefined);
    
      
    
      const [isReadyForLocationAndTime, setIsReadyForLocationAndTime] =
        useState(false);
      const [markerColor, setMarkerColor] =
        useState(null);
      
    
      const watchFields = watch(['image', 'title', 'type']);
      useEffect(() => {
        if (buttonDraft) {
          reset(buttonDraft);
        }
        // debugger;
        const subscription = watch((value, { name, type }) => {
          const values = getValues()
          if ( values?.image?.length > 0 && values.title.length > 0 && values.type.length > 0)
          {
            setIsReadyForLocationAndTime(true);
          }else {
            setIsReadyForLocationAndTime(false);
          }
          const buttonType = buttonTypes.find((buttonType) => {
            return buttonType.name === values.type
          })
          if (buttonType){
            setMarkerColor(buttonType.color)
          }
        });
        return () => subscription.unsubscribe();
        
      }, [buttonDraft, watch]);

      
    return (<>
    
{selectedNetwork ? (
    <Popup title="Publish Button" linkFwd="/Explore">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        classNameExtra="publish_btn"
      >
        <div className="publish_btn-first">
          <ButtonType
            name="type"
            {...register('type', { required: true })}
            validationError={errors.type}
          />
          <FieldTextArea
            name="title"
            label="Title"
            placeholder="Write a title for your button"
            validationError={errors.title}
            {...register('title', { required: true })}
          />
          <FieldTextArea
            label="Description:"
            name="description"
            placeholder="Write a description for your button"
            validationError={errors.description}
            classNameExtra="squared"
            {...register('description', {
              required: true,
              minLength: 10,
            })}
          />

          
          {/* TODO: Warning: Cannot update a component (`ButtonNew`) while rendering a different component (`FieldTags`). To locate the bad setState() call inside `FieldTags`, follow the stack trace as described in https://reactjs.org */}
          <FieldTags
            label="Tag suggestions"
            name="tags"
            control={control}
            validationError={errors.tags}
            watch={watch}
          />
        </div>
        <div className="publish_btn-scd">
          <FieldImageUploads
            name="image"
            label="+ Add image"
            // width={55}
            // height={125}
            {...register('image', { required: true })}
            // validationError={errors.image}
            setValue={setValue}
          />
          {isReadyForLocationAndTime && (
            <>
              <FieldLocation
                defaultZoom={selectedNetwork.zoom}
                validationErrors={undefined}
                setValue={setValue}
                watch={watch}
                markerImage={watch('image')[0]}
                markerCaption={watch('title')}
                markerColor={markerColor}
              />
              <FieldDate
                setValue={setValue}
                watch={watch}
                title="When ?"
              />
            </>
          )}
          {/* <ButtonNewDate title="When ?" setDate={setDate} date={date} /> */}
          <ButtonShare />
        </div>
        <div className="publish__submit">
          <FormSubmit
            classNameExtra="create_btn"
            title="Publish"
            isSubmitting={isSubmitting}
          />
        </div>
      </Form>
    </Popup>
  ) : (
    <div>Loading network...</div>
  )}
    </>);
  }
  
