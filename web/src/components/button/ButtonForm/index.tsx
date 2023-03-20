//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import React, { useEffect, useState } from 'react';
import Form from 'elements/Form';

import Popup from 'components/popup/Popup';
import ButtonType from 'components/button/ButtonType';

import FieldLocation from 'elements/Fields/FieldLocation';
import { FieldTextArea } from 'elements/Fields/FieldTextArea';
import FormSubmit from 'elements/Form/FormSubmit';
import ButtonShare from 'components/button/ButtonShare';
// import ButtonNewDate from 'components/button/ButtonNewDate';
import FieldTags from 'elements/Fields/FieldTags';
import { useRef } from 'store/Store';
import { buttonTypes } from 'shared/buttonTypes';
// import FieldImageUpload from "elements/Fields/FieldImageUpload";
import { GlobalState, store } from 'pages';
import {FieldImageUpload} from 'elements/Fields/FieldImageUpload';

export default function ButtonForm({onSubmit, watch, reset, getValues, handleSubmit, register, errors, control, setValue, setFocus, isSubmitting}) {
    const selectedNetwork = useRef(
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
            watch={watch}
            setValue={setValue}
            setFocus={setFocus}
            {...register('title', { required: true })}
          />
          <FieldTextArea
            label="Description:"
            name="description"
            placeholder="Write a description for your button"
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
            label="Tag suggestions"
            name="tags"
            control={control}
            validationError={errors.tags}
            watch={watch}
          />
        </div>
        <div className="publish_btn-scd">
          <FieldImageUpload
            name="image"
            label="+ Add image"
            // width={55}
            // height={125}
            setValue={setValue}
            validationError={errors.logo}
            control={control}
            {...register('image', { required: true })}
            // validationError={errors.image}
          />
          {isReadyForLocationAndTime && (
            <>
              <FieldLocation
                defaultZoom={selectedNetwork.zoom}
                validationErrors={undefined}
                setValue={setValue}
                watch={watch}
                markerImage={watch('image')}
                markerCaption={watch('title')}
                markerColor={markerColor}
              />
              {/* <FieldDate
                setValue={setValue}
                watch={watch}
                title="When ?"
              /> */}
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
  
