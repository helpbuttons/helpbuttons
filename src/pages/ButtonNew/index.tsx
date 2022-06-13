//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Form from "elements/Form";

import Popup from "components/popup/Popup";
import ButtonType from "components/button/ButtonType";

import { store } from "pages/index";
import { CreateButtonEvent } from "pages/ButtonNew/data";
import { IButton } from "services/Buttons/button.type";
import FieldLocation from "elements/Fields/FieldLocation";
import PopupSection from "components/popup/PopupSection";
import FieldTextArea from "elements/Fields/FieldTextArea";
import PopupOptions from "components/popup/PopupOptions";
import FormSubmit from "elements/Form/FormSubmit";
import ButtonShare from "components/button/ButtonShare";
import ButtonNewDate from "components/button/ButtonNewDate";
import FieldUploadImage from "elements/Fields/FieldImageUpload/index";
// import Location from 'elements/Location';

export default function ButtonNew() {
  const networkId = window.localStorage.getItem("network_id");
  const token = window.localStorage.getItem("access_token");

  // TODO: tags

  const fields = {
    name: "",
    templateButtonId: null,
    type: "",
    description: "",
    latitude: null,
    longitude: null,
    images: []
  };

  const [button, setValues] = useState<IButton>(fields);
  const [validationErrors, setValidationErrors] = useState(fields);
  const [date, setDate] = useState("");

  const {
    formState: { isSubmitting },
  } = useForm();

  const setValue = (name, value) => {
    setValues({ ...button, [name]: value });
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
            <FieldUploadImage
              name="images"
              handleChange={setValue}
              label="+ Add image (optional)"
            />
            <FieldTextArea
              label="Describe your purpose:"
              handleChange={setValue}
              name="description"
              placeholder="i.e. I would like to offer..."
              validationError={validationErrors.description}
            />
            <FieldLocation
              setValue={setValue}
              values={button}
              validationErrors={validationErrors}
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
