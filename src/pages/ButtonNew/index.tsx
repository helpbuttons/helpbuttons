//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Form from "elements/Form";

import Popup from "components/popup/Popup";
import ButtonType from "components/button/ButtonType";

import { GlobalState, store } from 'pages';
import { CreateButtonEvent } from "pages/ButtonNew/data";
import { IButton } from "services/Buttons/button.type";
import FieldLocation from "elements/Fields/FieldLocation";
import FieldTextArea from "elements/Fields/FieldTextArea";
import FormSubmit from "elements/Form/FormSubmit";
import ButtonShare from "components/button/ButtonShare";
import ButtonNewDate from "components/button/ButtonNewDate";
import FieldUploadImages from "elements/Fields/FieldImagesUpload/index";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";
import FieldTags from "elements/Fields/FieldTags";
import { useRef } from "store/Store";
// import Location from 'elements/Location';

export default function ButtonNew() {
  const token = localStorageService.read(LocalStorageVars.ACCESS_TOKEN);
  const selectedNetwork = useRef(store, (state :GlobalState) => state.common.selectedNetwork);

  const fields = {
    name: "",
    templateButtonId: null,
    type: "",
    description: "",
    latitude: null,
    longitude: null,
    images: [],
    tags: ["Video", "Call"]
  };

  const [button, setValues] = useState<IButton>(fields);
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    templateButtonId: null,
    type: "",
    description: "",
    latitude: null,
    longitude: null,
    images: null,
    tags: null
  });
  const [date, setDate] = useState("");

  const {
    formState: { isSubmitting },
  } = useForm({defaultValues: fields});

  const setValue = useCallback( (name, value) => {
    setValues((previousState) => {
      return { ...previousState, [name]: value };
    });
  }, []) ;

  const handleSubmit = (event) => {
    event.preventDefault();
    store.emit(
      new CreateButtonEvent(button, token, selectedNetwork.id, setValidationErrors)
    );
  };

  return (
    <>
      <Popup title="Publish Button" linkFwd="/Explore">
      <Form onSubmit={handleSubmit} classNameExtra="publish_btn">
        <div className="publish_btn-first">
          <ButtonType
            handleChange={setValue}
            name="type"
            validationError={validationErrors.type}
          />
          <FieldTextArea
            label="Description:"
            handleChange={setValue}
            name="description"
            placeholder="Write a description for your button"
            validationError={validationErrors.description}
            classNameExtra="squared"
          />
          <FieldTags
            label="Tag suggestions"
            handleChange={setValue}
            name="tags"
            validationError={validationErrors.tags}
          />
        </div>
        <div className="publish_btn-scd">
          <FieldUploadImages
            name="images"
            handleChange={setValue}
            label="+ Add image"
            maxNumber="4"
          />

          {selectedNetwork && (
            <FieldLocation
              setValue={setValue}
              values={button}
              validationErrors={validationErrors}
              initialLocation={{
                lat: selectedNetwork.location.coordinates[0],
                lng: selectedNetwork.location.coordinates[1],
              }}
            />
          )}

          <ButtonNewDate title="When ?" setDate={setDate} date={date} />
          <ButtonShare />
        </div>
        <div className="publish__submit">
          <FormSubmit classNameExtra="create_btn" title="Publish" isSubmitting={isSubmitting} />
        </div>
      </Form>
    </Popup>
  </>
  );
}
