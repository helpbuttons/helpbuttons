import React, { useState } from "react";
import Popup from "components/popup/Popup";
import { INetwork } from "services/Networks/network.type";
import { CreateNetworkEvent } from "./data";
import { store } from "pages/index";
import FieldText from "elements/Fields/FieldText";
import Form from "elements/Form";
import { useForm } from "react-hook-form";
import FieldCheckbox from "elements/Fields/FieldCheckbox";
import FieldNumber from "elements/Fields/FieldNumber";
import PopupOptions from "components/popup/PopupOptions";
import FormSubmit from "elements/Form/FormSubmit";
import FieldLocation from "elements/Fields/FieldLocation";
import PopupSection from "components/popup/PopupSection";
import FieldUploadImage from "elements/Fields/FieldImageUpload";

export default function NetworkNew() {
  const token = window.localStorage.getItem("access_token");
  const fields = {
    name: "",
    avatar: "",
    url: "",
    privacy: false,
    description: "",
    latitude: null,
    longitude: null,
    radius: null,
  };
  const [values, setValues] = useState<INetwork>(fields);
  const [validationErrors, setValidationErrors] = useState(fields);

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
    store.emit(new CreateNetworkEvent(values, token, setValidationErrors));
  };

  return (
    <>
      <Popup title="Create Network" linkFwd="/HomeInfo">
        <PopupSection>
          <Form onSubmit={handleSubmit}>
            <FieldText
              handleChange={setValue}
              value={values.name}
              name="name"
              label="Name"
              validationError={validationErrors.name}
            ></FieldText>
             <FieldUploadImage
              name="avatar"
              handleChange={setValue}
              label="+ Add avatar"
            />
            <FieldText
              handleChange={setValue}
              value={values.url}
              name="url"
              label="Url"
              validationError={validationErrors.url}
            ></FieldText>
            <FieldCheckbox
              label="Privacy"
              value={values.privacy}
              handleChange={setValue}
              name="privacy"
              validationError={validationErrors.privacy}
            ></FieldCheckbox>
            <FieldText
              handleChange={setValue}
              value={values.description}
              name="description"
              label="Description"
              validationError={validationErrors.description}
            ></FieldText>
            <FieldLocation
              setValue={setValue}
              values={values}
              validationErrors={validationErrors}
            />
            <PopupOptions>
              <FormSubmit title="Create Network" isSubmitting={isSubmitting} />
            </PopupOptions>
          </Form>
        </PopupSection>
      </Popup>
    </>
  );
}
