//this is the component integrated in buttonNewPublish to display the location. It shows the current location and has a button to change the location that displays a picker with the differents location options for the network
import React, { useState } from "react";
import FieldNumber from "../FieldNumber";
import FieldError from "../FieldError";
import "leaflet/dist/leaflet.css";

import Map from "components/map/LeafletMap";
export default function FieldLocation({ setValue, values, validationErrors }) {
  const [showHideMenu, setHideMenu] = useState(false);
  const style = { width: "100%", height: "600px" };

  const onClick = (e) => {
    setValue("latitude", e.coordinates[0]);
    setValue("longitude", e.coordinates[1]);
    setValue("radius", 20);
  };

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
            <Map addMarkerClick={onClick} style={style} />
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
