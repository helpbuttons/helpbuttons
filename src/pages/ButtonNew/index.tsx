//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Form from "elements/Form";

import Popup from "components/popup/Popup";
import ButtonType from "components/button/ButtonType";

import { GlobalState, store } from 'pages';
import { CreateButtonEvent } from "pages/ButtonNew/data";
import { IButton } from "services/Buttons/button.type";
import FieldLocation from "elements/Fields/FieldLocation";
import PopupSection from "components/popup/PopupSection";
import FieldTextArea from "elements/Fields/FieldTextArea";
import PopupOptions from "components/popup/PopupOptions";
import FormSubmit from "elements/Form/FormSubmit";
import ButtonShare from "components/button/ButtonShare";
import ButtonNewDate from "components/button/ButtonNewDate";
import FieldUploadImages from "elements/Fields/FieldImagesUpload/index";
import PickerTime from "components/picker/PickerPeriodDate";
import { localStorageService, LocalStorageVars } from "services/LocalStorage";
import FieldTags from "elements/Fields/FieldTags";
import { useRef } from "store/Store";
// import Location from 'elements/Location';

export default function ButtonNew() {
  const networkId = localStorageService.read(LocalStorageVars.NETWORK_SELECTED);
  const token = localStorageService.read(LocalStorageVars.ACCESS_TOKEN);
  const selectedNetwork = useRef(store, (state :GlobalState) => state.commonData.selectedNetwork);
  // TODO: tags

  const fields = {
    name: "",
    templateButtonId: null,
    type: "",
    description: "",
    latitude: null,
    longitude: null,
    images: [],
    tags: []
  };

  const [button, setValues] = useState<IButton>(fields);
  const [validationErrors, setValidationErrors] = useState(fields);
  const [date, setDate] = useState("");

  const {
    formState: { isSubmitting },
  } = useForm();

  const setValue = (name, value) => {
    setValues((previousState) => {
      return { ...previousState, [name]: value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    store.emit(
      new CreateButtonEvent(button, token, networkId, setValidationErrors)
    );
  };

  return (
    <>
      <Popup title="Create Button" linkFwd="/Explore">
        <PopupSection>
          <Form onSubmit={handleSubmit}>
            <ButtonType
              handleChange={setValue}
              name="type"
              validationError={validationErrors.type}
            />
            <FieldUploadImages
              name="images"
              handleChange={setValue}
              label="+ Add image (optional)"
              maxNumber="4"
            />
            <FieldTextArea
              label="Describe your purpose:"
              handleChange={setValue}
              name="description"
              placeholder="i.e. I would like to offer..."
              validationError={validationErrors.description}
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
            <FieldTags
              label="Tags"
              handleChange={setValue}
              name="tags"
              validationError={validationErrors.tags}
            />
            <ButtonNewDate setDate={setDate} date={date} />
            <ButtonShare />
            <PopupOptions>
              <FormSubmit title="Create Button" isSubmitting={isSubmitting} />
            </PopupOptions>
          </Form>
        </PopupSection>
      </Popup>
    </>
  );
}
