//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useState } from "react";
import FieldNumber from "../FieldNumber";
import FieldError from "../FieldError";

export default function FieldLocation({ setValue, values, validationErrors }) {
  const [showHideMenu, setHideMenu] = useState(false);

  return (
    <>
      <div className="form__field">
        <div className="card-button__city card-button__everywhere">
          {values.longitude}, {values.latitude} (radius: {values.radius} km)
        </div>

        <div className="btn" onClick={() => setHideMenu(!showHideMenu)}>
          Change place
        </div>
        <FieldError validationError={validationErrors.latitude} />
        <FieldError validationError={validationErrors.longitude} />
        <FieldError validationError={validationErrors.radius} />
      </div>

      {showHideMenu && (
        <div className="picker__close-container">
          <div className="picker--over picker-box-shadow picker__content picker__options-v">
            <fieldset>
              <FieldNumber
                handleChange={setValue}
                value={values.latitude}
                name="latitude"
                label="Latitude"
                validationError={validationErrors.latitude}
              ></FieldNumber>

              <FieldNumber
                handleChange={setValue}
                value={values.longitude}
                name="longitude"
                label="Longitude"
                validationError={validationErrors.longitude}
              ></FieldNumber>

              <FieldNumber
                handleChange={setValue}
                value={values.radius}
                name="radius"
                label="Radius"
                validationError={validationErrors.radius}
              ></FieldNumber>
            </fieldset>
          </div>

          <div
            className="picker__close-overlay"
            onClick={() => setHideMenu(false)}
          ></div>
        </div>
      )}
    </>
  );
}
