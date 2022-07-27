//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import React, { useCallback, useState } from "react";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import Form from "elements/Form";

import Popup from "components/popup/Popup";
import { ButtonType } from "components/button/ButtonType";

import { GlobalState, store } from "pages";
import { CreateButton } from "state/Explore";
import { IButton } from "services/Buttons/button.type";
import FieldLocation from "elements/Fields/FieldLocation";
import { FieldTextArea } from "elements/Fields/FieldTextArea";
import FormSubmit from "elements/Form/FormSubmit";
import ButtonShare from "components/button/ButtonShare";
import ButtonNewDate from "components/button/ButtonNewDate";
import FieldUploadImages from "elements/Fields/FieldImagesUpload/index";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";
import FieldTags from "elements/Fields/FieldTags";
import { useRef } from "store/Store";
import { NavigateTo } from "state/Routes";
import FieldText from "elements/Fields/FieldText";
import FieldError from "elements/Fields/FieldError";


export default function ButtonNew() {
  const token = localStorageService.read(LocalStorageVars.ACCESS_TOKEN);
  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork
  );

  const [tags, setTags] = useState([]);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm();
  const [errorMsg, setErrorMsg] = useState(undefined);

  const onSubmit = (data) => {
    console.log(data);
    // store.emit(
      // new CreateButton(data, token, selectedNetwork.id, setValidationErrors)
    // );
  };

  const onSuccess = () => {
    store.emit(new NavigateTo("/Explore"));
  };

  const onError = (err) => {
    
  };



  // const fields = {
  //   name: "",
  //   templateButtonId: null,
  //   type: "",
  //   description: "",
  //   latitude: null,
  //   longitude: null,
  //   images: [],
  //   tags: ["Video", "Call"]
  // };

  // const [button, setValues] = useState<IButton>(fields);
  // const [validationErrors, setValidationErrors] = useState({
  //   name: "",
  //   templateButtonId: null,
  //   type: "",
  //   description: "",
  //   latitude: null,
  //   longitude: null,
  //   images: null,
  //   tags: null
  // });
  // const [date, setDate] = useState("");

  // const {
  //   formState: { isSubmitting },
  // } = useForm({defaultValues: fields});

  // const setValue = useCallback( (name, value) => {
  //   setValues((previousState) => {
  //     return { ...previousState, [name]: value };
  //   });
  // }, []) ;

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   store.emit(
  //     new CreateButton(button, token, selectedNetwork.id, setValidationErrors)
  //   );
  // };

  return (
    <>
      <Popup title="Publish Button" linkFwd="/Explore">
        <Form onSubmit={handleSubmit(onSubmit)} classNameExtra="publish_btn">
          <div className="publish_btn-first">
            <ButtonType
              name="type"
              {...register("type", {required: true})}
              validationError={ errors.type }
            />
            <FieldTextArea
              label="Description:"
              name="description"
              placeholder="Write a description for your button"
              validationError={errors.description}
              classNameExtra="squared"
              {...register("description", {required: true, minLength: 10})}
            />

            {/* TODO: Warning: Cannot update a component (`ButtonNew`) while rendering a different component (`FieldTags`). To locate the bad setState() call inside `FieldTags`, follow the stack trace as described in https://reactjs.org */}
            <FieldTags
              label="Tag suggestions"
              name="tags"
              control={control}
              validationError={errors.tags}
            />

          </div>
          <div className="publish_btn-scd">
            <FieldUploadImages
              name="images"
              label="+ Add image"
              maxNumber="4"
              control={control}
            />

            {selectedNetwork && (
              <FieldLocation
                setValue={(a, location) => {setLocation(location)}}
                control={control}
                validationErrors={undefined}
                initialLocation={{
                  lat: selectedNetwork.location.coordinates[0],
                  lng: selectedNetwork.location.coordinates[1],
                }}
              />
            )}

            {/* <ButtonNewDate title="When ?" setDate={setDate} date={date} />
            <ButtonShare /> */}
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
    </>
  );
}